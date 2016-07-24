$(document).ready(function () {
    function hideSplash() {
        var $splash = $("div.splash-loading");

        $splash.addClass('unvisible');
        $splash.one('transitionend', function () {
            setTimeout(function () {
                $splash.hide();
            }, 20);
        });
    }

    function showSplash() {
        var $splash = $("div.splash-loading");
        $splash.show();
        $splash.removeClass('unvisible');
    }

    function translate(lang, callback) {
        var _path = 'i18n/' + lang + '.json';

        var _load = {};
        _load[lang] = _path;
        $.i18n().load(_load).done(function () {
            $.i18n().locale = lang;

            $("*[data-i18n]").each(function () {
                var $curr = $(this);
                var transl = $.i18n($curr.attr("data-i18n"));
                if ($curr.is('[placeholder]')) {
                    $curr.attr("placeholder", transl);
                    $curr.val('');
                } else {
                    $curr.html($.i18n(transl));
                }

                if (typeof callback === "function") {
                    callback();
                }
            });
        });
    }

    function detectCountryCode(callback) {
        var fallbackCountryCode = "gb";

        $.ajax({
            url: 'http://ip-api.com/json',
            timeout: 2500,
            dataType: "jsonp"
        }).done(function(data) {
            var browserCountry = data.countryCode.toLowerCase();
            if (typeof callback === "function")
                callback(browserCountry);
        }).fail(function() {
            if (typeof callback === "function")
                callback(fallbackCountryCode);
        });
    }

    function detectAvailableLanguages() {
        var availableLanguages = {};

        $(".lang-panel .lang-code").each(function () {
            var _lang = $(this).attr("data-lang");
            var _countries = $(this).attr("data-country");
            if (_countries.indexOf(',') > -1) {
                _countries = _countries.split(',');
            } else {
                _countries = [_countries];
            }

            for (var i = 0; i < _countries.length; i++) {
                var country = _countries[i];
                availableLanguages[country] = _lang;
            }
        });

        return availableLanguages;
    }


    $(window).load(function () {
        $(".owl-carousel").owlCarousel({
            items: 3
        });

        var defaultLanguage = "en";
        console.log("i18n: Default language: " + defaultLanguage);

        var availableLanguages = detectAvailableLanguages();
        console.log("i18n: Available languages {country: language, ...}: ", availableLanguages);

        detectCountryCode(function(country){
            console.log("i18n: Browser country: " + country);

            var selectedLanguage = availableLanguages[country] ? availableLanguages[country] : defaultLanguage;
            console.log("i18n: Selected language: " + selectedLanguage);

            $(".lang-panel .lang-code").each(function () {
                var _lang = $(this).attr("data-lang");
                $(this).click(function () {
                    showSplash();
                    translate(_lang, function() {
                        hideSplash();
                    });
                });
            });
            console.log("i18n: Language switchers bind");


            translate(selectedLanguage, function () {
                hideSplash();
            });
        });
    });
});