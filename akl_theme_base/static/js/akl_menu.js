odoo.define('akl_theme_base.Menu', function (require) {
    "use strict";

    var dom = require('web.dom');
    var SystrayMenu = require('web.SystrayMenu');
    var Widget = require('web.Widget');
    var Menu = require('web.Menu');
    var aklAppsMenu = require('akl_theme_base.AppsMenu')
    var aklBus = require('akl_theme_base.bus')
    var session = require('web.session');

    var AklMenu = Menu.include({
        
        template: 'alk_simple_theme.Menu',

        events: _.extend({}, Menu.prototype.events, {
            'click .company_logo': '_onLogoClick',
            "click .sub_menu_toggler": '_on_sub_menu_toggler_click'
        }),

        start: function () {
            var self = this;

            this.$menu_apps = this.$('.o_menu_apps');
            this.$menu_brand_placeholder = this.$('.o_menu_brand');
            this.$section_placeholder = this.$('.o_menu_sections');

            // Apps Menu
            this._appsMenu = new aklAppsMenu(this, this.menu_data);
            var appsMenuProm = this._appsMenu.appendTo(this.$menu_apps);

            // Systray Menu
            this.systray_menu = new SystrayMenu(this);
            var systrayMenuProm = this.systray_menu.attachTo(this.$('.o_menu_systray')).then(function () {
                self.systray_menu.on_attach_callback();  // At this point, we know we are in the DOM
                dom.initAutoMoreMenu(self.$section_placeholder, {
                    maxWidth: function () {
                        return self.$el.width() - (
                            self.$menu_apps.outerWidth(true) + self.$menu_brand_placeholder.outerWidth(true) + self.systray_menu.$el.outerWidth(true));
                    },
                    sizeClass: 'SM',
                });
            });

            return Promise.all([Widget.prototype.start.apply(this, arguments), appsMenuProm, systrayMenuProm]);
        },

        _on_sub_menu_toggler_click: function(event) {
            aklBus.trigger('toggle_secondary_nav');
        },

        _onLogoClick: function (ev) {

            var self = this;
            ev.preventDefault();
            this._rpc({
                model: 'res.users',
                method: 'read',
                args: [[session.uid], ['company_id']],
            })
                .then(function (data) {
                    self._rpc({
                        route: '/web/action/load',
                        params: { action_id: 'base.action_res_company_form' },
                    })
                        .then(function (result) {
                            result.res_id = data[0].company_id[0];
                            result.target = "new";
                            result.views = [[false, 'form']];
                            result.flags = {
                                action_buttons: true,
                                headless: true,
                            };
                            self.do_action(result, {
                                on_close: self.update_logo.bind(self, true),
                            });
                        });
                });
            return false;
        },

        update_logo: function (reload) {
            var company = session.company_id;
            var img = session.url('/web/binary/company_logo' + '?db=' + session.db + (company ? '&company=' + company : ''));
            this.$('.navigation-logo a img').attr('src', '').attr('src', img + (reload ? "&t=" + Date.now() : ''));
            this.$('.oe_logo_edit').toggleClass('oe_logo_edit_admin', session.is_superuser);
        }
    })

    return AklMenu;
})