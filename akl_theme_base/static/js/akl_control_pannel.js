odoo.define('akl_theme_base.ControlPanel', function (require) {
    "use strict";

    const ControlPanel = require('web.ControlPanel');

    const { Portal } = owl.misc;
    const { useState } = owl.hooks;
    const { device } = require("web.config");


    ControlPanel.patch('akl_theme_base.ControlPanel', T => {

        class AklControlPannel extends T {
            constructor() {
                super(...arguments);
                this.state = useState({
                    isMobile: device.isMobile
                });
                device.bus.on('size_changed', this, this._onDeviceSizeChanged);
            }

            _onDeviceSizeChanged() {
                this.state.isMobile = device.isMobile? true : false
            }
        }

        AklControlPannel.components.Portal = Portal;
        AklControlPannel.template = "akl_theme_base.ControlPanel";

        return AklControlPannel;
    });
});
