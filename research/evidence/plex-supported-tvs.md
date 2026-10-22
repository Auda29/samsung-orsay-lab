# Support Articles

# Which Smart TV models are supported?

Plex offers player apps across a wide range of smart TV manufacturers and models. These are broken out into two broad categories:

1. Specific manufacturers/brands
2. Broader smart TV operating systems, which may be available across many different TV brands

For any particular platform, the playback capabilities may be affected by several factors, including the extent to which we can directly test on the platform ourselves, the (Plex) user base on the platform, and more. Some of the platforms will have limited playback capabilities because of these factors. Other platforms receive more customized capabilities.

## Available Manufacturers/Brands

On the following systems, the Plex app has been customized to be able to take advantage of the expanded playback capabilities of each device. Exact capabilities can vary, but Plex running on these systems is not restricted to the “Limited” playback capabilities outlined in the dedicated section later in the article.

### LG

Our current app is available on 4K/UHD LG television models running webOS 3.0 or newer system software.

**Note**: Due to root certificate limitations with the device OS itself, only webOS 5.0+ devices support secure connections with a personal Plex Media Server. To allow connections to a personal server, devices running earlier webOS versions must be set to `Allow Insecure Connections` in the TV app settings and the Plex Media Server must be set to `Preferred` for the Secure Connections preference.

### Samsung

The app is available on 2016 and newer model year Samsung sets that are Tizen-based. The exception is for users located in China or Iran; the app is not currently available for users in those countries.

**Related Page**: [Tizen-based Samsung TV models](http://developer.samsung.com/tv/develop/specifications/tv-model-groups/)

**Related Page**: [What do Samsung TV model numbers actually mean?](http://www.samsung.com/uk/support/skp/faq/1052003)

**Note**: Due to root certificate limitations with the device OS itself, most Samsung models will not support secure connections with a personal Plex Media Server. To allow connections to a personal server, you should ensure that the app is set to `Allow Insecure Connections` (and to allow fallback to insecure connections) in the TV app settings and the Plex Media Server must be set to `Preferred` for the Secure Connections preference.

### VIDAA OS (e.g. Hisense)

Our current app is available on VIDAA-based television models running the following system software VIDAA U4 and higher.

### VIZIO

Our Plex app is available on “SmartCast” VIZIO model televisions. (Typically, that’s VIZIO models released in 2018 and later.)

## Devices with Limited Playback Capabilities

While Plex is available on the following models, brands, and operating systems, the playback capabilities are limited, as outlined below.

### Understanding Limited Playback Capabilities

#### Does My App Have “Limited” Playback Capabilities?

Determining whether or not the smart TV app you’re using is affected by these limited playback capabilities is easy. Open the Plex app and go to Settings > About > App Name and look at the value there:

- `Plex for [specific brand]`: If the app shows a value like “Plex for LG” or “Plex for Samsung”, then the app is not affected by the specific limited capabilities mentioned below.
- `Plex for Smart TVs`: If the value is simply “Plex for Smart TVs” (and not a specific brand), then that means the app _**does**_ have limited playback capabilities.

#### Specific Playback Capabilities

The “Plex for Smart TVs” app supports the following limited capabilities for video and audio playback.

**Video:**

- Bit Rate: 4Mbps max
- Resolution: 1080p max
- Bit Depth: 8
- Codec: H.264
- Container: mp4, mpegts, mov
- Audio: AAC, 2 channels

**Music/Audio:**

- AAC
  - 2 channels
- FLAC
- MP3
  - 2 channels
  - 320 Kbps
  - mp3 container

### AOC

The app is available on select, specific TV models and only in the following countries: Australia, Colombia, the European Union, Germany, Great Britain, India, Lithuania, the Philippines, South Korea, Spain, Russia.

- MTK5596L (2017)
- MTK5800 (2017)
- MTK5596L (2018)
- MTK5800 (2018)
- MTK5802 (2018)
- MTK9288 (2020)
- NVT671 (2020)

### Atari VCS

Plex is available on the Atari VCS mini-PC system.

**Related Page**: [Atari VCS](https://atarivcs.com/)

### Coolita

Plex is currently available on Coolita television models available in several countries, such as India, Malaysia, the Philippines, Thailand, and Vietnam.

### Evoca TV Set-top Boxes

Evoca TV set-top boxes are available in several states in the United States. Plex is available on those boxes.

**Related Page**: [Evoca TV](https://evoca.tv/)

### Fetch Devices

The Plex app is available on the following Fetch devices in Australia and New Zealand:

- Mighty
- Mini
- Mini 4K

**Related Page**: [Fetch Product Comparison](https://www.fetchtv.com.au/products/compare)

### Foxxum CTV OS

Plex is available on 2019+ model year televisions running **Foxxum CTV OS**. For further details on specific TV models, you can contact [support@foxxum.com](mailto:support@foxxum.com).

### Philips

The app is available on select, specific TV models and only in the following countries: Australia, Colombia, the European Union, Germany, Great Britain, India, Lithuania, the Philippines, South Korea, Spain, Russia.

- MTK5596L (2017)
- MTK5800 (2017)
- MTK5802 (2017)
- MTK5800 (2018)
- MTK5802 (2018)
- MTK5806 (2019)
- MTK5806 (2020)
- MTK9288(2020)
- NVT671 (2021)

* * *

## Plex Availability on Other TV Systems

Other Plex apps are also available for the following smart TV operating systems.

### Android TV/Google TV

Official “Android TV” or “Google TV” devices can run our regular Android app, which is available in the Google Play Store.

**Related Page**: [Android TV, Fire TV](https://support.plex.tv/articles/categories/player-apps-platforms/android-tv/)

**Related Page**: [Google Play Store: Plex](https://play.google.com/store/apps/details?id=com.plexapp.android)

### Chromecast

Plex is available on Chromecast devices, both separate and those built into TV sets.

**Related Page**: [Chromecast](https://support.plex.tv/articles/categories/player-apps-platforms/chromecast/)

### Fire TV (Amazon)

Fire TV devices can run our standard Android app, available from the Amazon Appstore.

**Related Page**: [Android TV, Fire TV](https://support.plex.tv/articles/categories/player-apps-platforms/android-tv/)

**Related Page**: [Amazon Appstore: Plex](https://www.amazon.com/Plex-Inc-for-Android/dp/B004Y1WCDE/)

### Roku TV

Our standard Plex app (channel) is available for Roku TV devices from their Roku Channel Store.

**Related Page**: [Roku](https://support.plex.tv/articles/categories/player-apps-platforms/roku/)

**Related Page**: [Roku Channel Store: Plex](https://channelstore.roku.com/details/13535/plex)

## No Longer Supported TVs

While we previously offered apps for the following smart TV platforms and models, they are no longer actively supported. An older version of our app may still be available on the devices, but the old app will not be receiving updates, may not be compatible with newer features or server releases, and could stop being functional in the future.

**Warning**: Since these platforms and models are no longer supported, we encourage users to instead make use of a modern Plex app on a supported platform. For instance, we have Plex apps available on Roku, Chromecast, Apple TV, Fire TV, Android TV, game consoles, etc.

### LG

Our old (no longer supported app) was available for NetCast (2013 models), webOS Lite, webOS 1.0, and webOS 2.0 models.

### Opera

All TVs based on the Opera operating system. This includes Sony sets that used to have a “Vewd” app store.

### Panasonic

2014 and newer Panasonic sets (including those running Firefox OS).

### TiVo

Series 4 and newer TiVo devices.

### Toshiba

Smart TV Alliance-compatible Toshiba television models.

Share this

Was this article helpful?

[Yes](https://support.plex.tv/articles/204080173-which-smart-tv-models-are-supported/#vote) [No](https://support.plex.tv/articles/204080173-which-smart-tv-models-are-supported/#)

1000
You've already provided feedback for this article, thank you for helping us improve our articles.Thank you for helping us improve our articles.Thank you for helping us improve our articles! We'll take it from here.You've already provided feedback for this article, thank you.Looks like you already left that comment.
To vote if this article was helpful, please [sign in](https://www.plex.tv/sign-in/?forward=https://support.plex.tv/articles/204080173-which-smart-tv-models-are-supported/) with your plex account.

Last modified on: January 21, 2025

#### We value your privacy.

Plex and our partners use standard Web technologies, such as browser cookies, which may be necessary to make our site work and enable core functionality, such as security, network management, and accessibility. You may disable these by changing your browser settings, but note that it may affect how our site functions.

We’d also like to enable analytics cookies, optional to you, to improve our website by collecting and reporting information on how you use it; we specifically use Google and Facebook analytics to derive insights about who is doing what on our site and to help us improve your experience. We won’t set these optional cookies unless you agree to and enable them. This tool will set a cookie on your device to remember your preferences once you have accepted.

I Accept

I Reject

[More Options](https://support.plex.tv/articles/204080173-which-smart-tv-models-are-supported/)

### Account Sign inCreate your free account

No credit card required.

#### We value your privacy.

Plex and our partners use standard Web technologies, such as browser cookies, which may be necessary to make our site work and enable core functionality, such as security, network management, and accessibility. You may disable these by changing your browser settings, but note that it may affect how our site functions.

We’d also like to enable analytics cookies, optional to you, to improve our website by collecting and reporting information on how you use it; we specifically use Google and Facebook analytics to derive insights about who is doing what on our site and to help us improve your experience. We won’t set these optional cookies unless you agree to and enable them. This tool will set a cookie on your device to remember your preferences once you have accepted.

I AcceptI Reject [More Options](https://support.plex.tv/articles/204080173-which-smart-tv-models-are-supported/)

## Plex’s use of cookies

Necessary cookies make our site work. We’d also like to enable analytics cookies, optional to you, to help us improve the site and your experience. This tool will set a cookie on your device to remember your preferences once you have accepted. You can change your mind and change your consent choices at any time by returning to this site.

For more information on how these cookies work please see our [Tracking Technologies page](https://www.plex.tv/about/privacy-legal/tracking-technologies/).

### Necessary cookies

Necessary cookies enable core functionality on our site, such as security, network management, and accessibility. You may disable these by changing your browser settings, but it may affect how the site functions.

### Analytics cookies

Analytics cookies help us improve our website by collecting and reporting information on how you use it; we specifically use Google analytics to derive insights about who is doing what on our site. These cookies collect information anonymously.

OFF

### Third Party Cookies

Third-party cookies enable us to correctly attribute traffic driven to our site; specifically, we use Facebook cookies to measure performance of Facebook campaigns, as well as cookies from Commission Junction, which help us see traffic directed to our site by affiliates we work with in marketing.

OFF

Accept All

Reject All

Save & Exit
