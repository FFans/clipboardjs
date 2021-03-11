import { extend } from 'flarum/extend';
import app from 'flarum/app';

import CommentPost from 'flarum/components/CommentPost';
import ClipboardJS from 'clipboard';

import { getTheme } from './getTheme';
import { codeLang } from "./codeLang";

app.initializers.add('ffans/clipboardjs', () => {
    var clipboard = null;
    var theme_name, themeElements, btnChild, btnChildT, btnChildF;

    function getAtt(key) {
        return app.forum.attribute('ffans-clipboardjs.' + key);
    }
    function getTrans(key) {
        return app.translator.trans('ffans-clipboardjs.admin.settings.' + key);
      }
    extend(CommentPost.prototype, 'oncreate', function () {
        theme_name = getAtt('theme_name');
        themeElements = getTheme(theme_name);

        if (getAtt('is_copy_enable') == 1) {
            codeLang();
            btnChild = themeElements[0];
            btnChildT = themeElements[1];
            btnChildF = themeElements[2];
    
            var pres = this.element.querySelectorAll('pre');
            [].forEach.call(pres, function (pre) {
                if (pre.className.indexOf("copy-ready") == -1)
                    pre.insertAdjacentHTML('afterBegin',
                        '<button class="clipboard ' + getAtt('theme_name') + '" data-clipboard-snippet="">' + btnChild + '</button>'
                    );
                pre.classList.add("copy-ready");
                if (theme_name == 'lingcoder' || theme_name == 'csdn') {
                    pre.classList.add("sticky");
                }
            });
            
            
        }
    });
    if (clipboard) {
        clipboard.destroy();
    }

    clipboard = new ClipboardJS('[data-clipboard-snippet]', {
        target: function (trigger) {
            return trigger.nextElementSibling;
        }
    });

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);

        e.trigger.classList.add("succeed");

        if(isNaN(btnChildT))
            e.trigger.innerHTML = btnChildT;

        setTimeout(function () {
            e.trigger.classList.remove("succeed");
            e.trigger.innerHTML = btnChild;
        }, 1000)

        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);

        e.trigger.classList.add("failed");
        if(isNaN(btnChildT))
            e.trigger.innerHTML = btnChildF;

        setTimeout(function () {
            e.trigger.classList.remove("failed");
            e.trigger.innerHTML = btnChild;
        }, 1000)

        fallbackMessage(e.action);
    });

    function fallbackMessage(action) {
        var actionMsg = '';
        var actionKey = (action === 'cut' ? 'X' : 'C');
        if (/iPhone|iPad/i.test(navigator.userAgent)) {
            actionMsg = getTrans('no_support');
        } else if (/Mac/i.test(navigator.userAgent)) {
            actionMsg = app.translator.trans('ffans-clipboardjs.forum.mac_msg',{
                actionKey: actionKey,
                action: action,
            });
        } else {
            actionMsg = app.translator.trans('ffans-clipboardjs.forum.pc_msg',{
                actionKey: actionKey,
                action: action,
            });
        }
        actionMsg = actionMsg.join("");
        console.log(actionMsg);
        alert(actionMsg);
    }
    extend(CommentPost.prototype, 'headerItems', function () {
        if (getAtt('is_show_codeLang') == 1) {
            codeLang();
        }
    })
});
