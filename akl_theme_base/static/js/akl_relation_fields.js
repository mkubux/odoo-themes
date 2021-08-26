odoo.define('akl_theme_base.relational_fields', function (require) {
    "use strict";

    var config = require('web.config');
    var core = require('web.core');
    var relational_fields = require('web.relational_fields');
    var FieldStatus = relational_fields.FieldStatus;

    var qweb = core.qweb;
    var _t = core._t;

    FieldStatus.include({
        start: function() {
            this._super.apply(this, arguments)
            config.device.bus.on('size_changed', this, this._onDeviceSizeChanged);
        },

        isEmpty: function () {
            return !this.isSet();
        },

        _render: function () {
            if (!config.device.isMobile) {
                this._super.apply(this, arguments);
            } else {
                this.$el.html(qweb.render("Awsome.FieldStatus.mobile", {
                    selection: this.status_information,
                    status: _.findWhere(this.status_information, { selected: true }),
                    clickable: this.isClickable,
                }));
            }
        },

        _onDeviceSizeChanged() {
            this._render()
        }
    });
});
