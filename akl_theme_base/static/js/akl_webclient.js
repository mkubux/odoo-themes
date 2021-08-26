odoo.define('akl.WebClient', function (require) {
    "use strict";
    
    var WebClient = require('web.WebClient');
    var config = require('web.config');
    var core = require('web.core');
    var data_manager = require('web.data_manager');
    var dom = require('web.dom');
    var aklSideBarMenu = require('akl_theme_base.side_bar_menu')
    var aklBus = require('akl_theme_base.bus')

    // use akl menu to replace system menu
    var Menu = require('web.Menu');
    require("akl_theme_base.Menu")

    var session = require('web.session');
    
    return WebClient.include({

        start: function () {
            this._super.apply(this, arguments)

            aklBus.on('toggle_secondary_nav', this, this._on_toggle_seconddary_nav)

            var $body = $('body')
            $(document).on("click", "*", function (event) {
                var width = $(window).width()
                if (!$(event.target).is($(".navigation, .navigation *, .navigation-toggler *")) &&  width < 1200) {
                    $body.removeClass("navigation-show")
                }
            });
            
        },

        /**
         * extend to add side bar
         */
        instanciate_menu_widgets: function () {
            var self = this;
            var proms = [];
            return this.load_menus().then(function (menuData) {
                self.menu_data = menuData;
    
                // Here, we instanciate every menu widgets and we immediately append them into dummy
                // document fragments, so that their `start` method are executed before inserting them
                // into the DOM.
                if (self.menu) {
                    self.menu.destroy();
                }
                self.menu = new Menu(self, menuData);
                proms.push(self.menu.prependTo(self.$el));

                // init SideBar menu
                self._sideBarMenu = new aklSideBarMenu(self, menuData)
                proms.push(self._sideBarMenu.prependTo(self.$el));

                return Promise.all(proms);
            });
        },

        on_hashchange: function (event) {

            if (this._ignore_hashchange) {
                this._ignore_hashchange = false;
                return Promise.resolve();
            }

            var self = this;
            return this.clear_uncommitted_changes().then(function () {
                var stringstate = $.bbq.getState(false);
                if (!_.isEqual(self._current_state, stringstate)) {
                    var state = $.bbq.getState(true);
                    if (state.action || (state.model && (state.view_type || state.id))) {
                        // load the action here
                        return self.menu_dp.add(self.action_manager.loadState(state, !!self._current_state)).then(function () {
                            if (state.menu_id) {
                                if (state.menu_id != self.menu.current_menu_id) {
                                    core.bus.trigger('change_menu_item', state.menu_id);
                                }
                            } else {
                                var action = self.action_manager.getCurrentAction();
                                if (action) {
                                    var menu_id = self.menu.action_id_to_primary_menu_id(action.id);
                                    if (state.menu_id != self.menu.current_menu_id) {
                                        core.bus.trigger('change_menu_item', menu_id);
                                    }
                                }
                            }
                        });
                    } else if (state.menu_id) {
                        var action_id = self.menu.menu_id_to_action_id(state.menu_id);
                        return self.menu_dp.add(self.do_action(action_id, { clear_breadcrumbs: true })).then(
                            function () {
                                core.bus.trigger('change_menu_item', state.menu_id);
                            });
                    } else {
                        self._sideBarMenu.openFirstApp();
                    }
                }
                self._current_state = stringstate;
            }, function () {
                if (event) {
                    self._ignore_hashchange = true;
                    window.location = event.originalEvent.oldURL;
                }
            });
        },

        _on_toggle_seconddary_nav: function() {
            var $menu_toggler = this.$('.navigation')
            if ($menu_toggler.hasClass('open')) {
                $menu_toggler.removeClass('open')
            } else {
                $menu_toggler.addClass('open')                
            }
        },

        show_application: function () {
            var self = this;
            
            this.set_title();
            return this.menu_dp.add(this.instanciate_menu_widgets()).then(function () {

                // bind has change method
                $(window).bind('hashchange', self.on_hashchange);

                // If the url's state is empty, we execute the user's home action if there is one (we
                // show the first app if not) 
                var state = $.bbq.getState(true);
                if (_.keys(state).length === 1 && _.keys(state)[0] === "cids") {
                    return self.menu_dp.add(self._rpc({
                        model: 'res.users',
                        method: 'read',
                        args: [session.uid, ["action_id"]],
                    }))
                        .then(function (result) {
                            debugger
                            var data = result[0];
                            if (data.action_id) {
                                return self.do_action(data.action_id[0]).then(function () {
                                    var primary_menu_id = self._sideBarMenu.action_id_to_primary_menu_id(data.action_id[0])
                                    self._sideBarMenu.change_menu_section(primary_menu_id);
                                });
                            } else {
                                self._sideBarMenu.openFirstApp();
                            }
                        });
                } else {
                    return self.on_hashchange();
                }
            });
        },
    })
})