/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'otsk-interactions-20180816\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-arrow-down': '&#xe92b;',
		'icon-arrow-up': '&#xe92c;',
		'icon-archive': '&#xe921;',
		'icon-button-new-project': '&#xe922;',
		'icon-edit': '&#xe923;',
		'icon-nav-data-factors': '&#xe924;',
		'icon-nav-manage': '&#xe925;',
		'icon-nav-objectives': '&#xe926;',
		'icon-nav-projects': '&#xe927;',
		'icon-nav-resources': '&#xe928;',
		'icon-zinc-global': '&#xe929;',
		'icon-zinc-local': '&#xe92a;',
		'icon-add-plus': '&#xe913;',
		'icon-button-approve': '&#xe914;',
		'icon-button-comment-off': '&#xe915;',
		'icon-button-comment-on': '&#xe916;',
		'icon-button-new-objective': '&#xe917;',
		'icon-button-rec-interaction': '&#xe918;',
		'icon-button-update-plan': '&#xe919;',
		'icon-empty-quarters': '&#xe91a;',
		'icon-filled-quarters': '&#xe91b;',
		'icon-objective': '&#xe91c;',
		'icon-read-more': '&#xe91d;',
		'icon-revert': '&#xe91e;',
		'icon-section-collapse': '&#xe91f;',
		'icon-section-expand': '&#xe920;',
		'icon-calendar': '&#xe900;',
		'icon-delete': '&#xe901;',
		'icon-hcp-hospital': '&#xe902;',
		'icon-hcp-location': '&#xe903;',
		'icon-interaction-email': '&#xe904;',
		'icon-interaction-face': '&#xe905;',
		'icon-interaction-phone': '&#xe906;',
		'icon-checkbox-checked': '&#xe907;',
		'icon-checkbox-unchecked': '&#xe908;',
		'icon-consent-circle': '&#xe909;',
		'icon-consent-no': '&#xe90a;',
		'icon-consent-no-sign': '&#xe90b;',
		'icon-consent-yes': '&#xe90c;',
		'icon-consent-yes-sign': '&#xe90d;',
		'icon-nav-logout': '&#xe90e;',
		'icon-nav-dashboard': '&#xe90f;',
		'icon-nav-hcps': '&#xe910;',
		'icon-nav-record': '&#xe911;',
		'icon-nav-report': '&#xe912;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
