# -*- coding: utf-8 -*-
{
    'name': "akl_theme_base",

    'summary': """
        akl theme base, theme for every one""",

    'description': """
        akl theme base, backend theme for everyone
    """,

    'author': "awsome odoo",
    'website': "http://www.awsomeodoo.com",
    'live_test_url': "http://akl.awsomeodoo.com",

    "category": "Themes/Backend",
    'version': '14.0.0.1',
    'license': 'OPL-1',
    'images': ['static/description/banner.png',
               'static/description/akl_screenshot.png'],

    'depends': ['base'],
    "application": False,
    "installable": True,
    "auto_install": False,

    'data': [
        'security/ir.model.access.csv',
        'views/akl_assets.xml',
        'views/akl_login.xml',
        'views/akl_base.xml',
    ],

    'qweb': [
        'static/xml/*.*',
    ]
}
