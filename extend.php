<?php

/*
 * This file is part of ffans/clipboardjs.
 *
 * Copyright (c) 2021 Golden.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FFans\ClipboardJS;

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),
    new Extend\Locales(__DIR__ . '/resources/locale'),
    function (Dispatcher $dispatcher) {
        $dispatcher->subscribe(Listeners\SaveSettings::class);
    },
];
