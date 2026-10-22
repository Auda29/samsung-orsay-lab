# Migrating Legacy Platform to Tizen

This topic describes how to convert applications from Samsung Legacy Platform to Tizen.

* * *

### Related Info

- [Application API](https://developer.samsung.com/SmartTV/develop/api-references/tizen-web-device-api-references/application-api.html)
- [AVPlay API](https://developer.samsung.com/SmartTV/develop/api-references/samsung-product-api-references/avplay-api.html)
- [Filesystem API](https://developer.samsung.com/SmartTV/develop/api-references/tizen-web-device-api-references/filesystem-api.html)
- [Web Storage API](http://www.w3.org/TR/2011/CR-webstorage-20111208/)

* * *

To migrate an application from Samsung Legacy Platform to Tizen, you must import the project to the Tizen Studio, and make the necessary changes in the code.

## Importing an Application Project

To import a Samsung Legacy Platform application to Tizen:

1. Remove the existing "config.xml" and "widget.info" files from the application.

**Important** The Samsung Legacy Platform "config.xml" file is not compatible with Tizen.

2. Create the project in the Tizen Studio.




You can do this in 2 different ways:


   - Create a new Web project in the Tizen Studio using the "Empty" template and copy the existing application files to the new project.
   - Import the existing Samsung Legacy Platform project to the Tizen Studio as a Tizen Web project.




     To import an existing project:

     1. In the Tizen Studio menu, go to "File > Import".
     2. Select "General > Existing Projects into Workspace" and click "Next".
     3. Select the existing project folder or archive file.

For more information, see [Creating Web Applications](https://developer.samsung.com/SmartTV/develop/getting-started/creating-tv-applications.html).

3. Create a new "config.xml" file for your project.




For more information, see [Configuring Web Applications](https://developer.samsung.com/SmartTV/develop/guides/fundamentals/configuring-tv-applications.html).


## Ensuring HTML5 Compatibility

To conform to HTML5 standards, modules from the Samsung Legacy Platform Common Modules API, such as the "Widget.js" and "PlugIn.js" libraries, are no longer supported. In Tizen, the Application Manager functionalities are handled using the [Application API](https://developer.samsung.com/SmartTV/develop/api-references/tizen-web-device-api-references/application-api.html).

- "Widget.js" library




Replace the "Widget.js" library methods with their HTML5 equivalents in Tizen.



| Samsung Legacy Platform | Tizen |
| --- | --- |
| `widgetAPI.putInnerHTML(pdiv,pContents)` | `pdiv.innerHTML = pContents` |
| `widgetAPI.blockNavigation()` | `event.preventDefault()` |
| `widgetAPI.sendReadyEvent()` | - |
| `widgetAPI.sendExitEvent()` | `tizen.application.getCurrentApplication().exit()` |
| `widgetAPI.sendReturnEvent()` | `tizen.application.getCurrentApplication().hide()` |


Table 1. Tizen equivalents to Samsung Legacy Platform "Widget.js" methods

- `curWidget` object




The `curWidget` object is not used in Tizen:
  - Before:



    `curWidget.id`
  - After:



    `tizen.application.getCurrentApplication().appInfo.id`
- Log messages




In Tizen, the `alert()` method is used to display popup windows. Use the `console.log()` method to print log messages.

- Viewport configuration




To display an application in fullscreen, set the application width as the viewport width in the "index.html" file:



```html

```





Copy





LightDark


For more information, see [Managing Screen Resolution](https://developer.samsung.com/SmartTV/develop/guides/fundamentals/managing-screen-resolution.html).

## Setting Content Security Policy

You must set the content security policy in the "config.xml" file. Tizen supports the W3C standard WARP security rules.

To set the content security policy for the application:

1. In the "Policy" tab of the configuration editor in the Tizen Studio, add a line to the table by clicking "+".
2. In the "Network URL" column, enter your server address.
3. In the "Allow subdomain" column, switch the value to "true" by clicking the table cell.






![Figure 1. Content security policy configuration](https://developer.samsung.com/media/2881/security-policy.png)

Figure 1. Content security policy configuration


## Ensuring User Interaction

Tizen handles user interaction differently from Samsung Legacy Platform:

- Anchor elements




In Samsung Legacy Platform, when mouse devices were not supported, applications registered the `keydown` event for clicks on an anchor element. In Tizen, use the `click` event for mouse and remote control clicks.




To migrate key handling on anchor elements to Tizen:
  - If there is only 1 anchor element, in the `body` element, register the key handler at the anchor element.
  - If there are multiple anchor elements, key handlers are needed, but each case can be implemented differently depending on the context.
- IME




Tizen provides the IME by default. When an `input` element is focused, the IME appears automatically. You do not need to create the IME using the `IMEShell()` method.




For more information on implementing the IME in Tizen, see [Keyboard/IME](https://developer.samsung.com/SmartTV/develop/guides/user-interaction/keyboardime.html).

- Key values




The key values in the Samsung Legacy Platform "TVKeyValue.js" library have changed in Tizen. If you want to continue using the same `keyValue` enumeration as before, include the `TizenTVKeyValue.js` file ( [direct download](http://vd.sdf.backup.pub.s3.amazonaws.com/media/2649/tizentvkeyvalue.zip)).



```html

```





Copy





LightDark









```javascript

```





Copy





LightDark

- Play/Pause key




The basic remote control was distributed with Samsung TVs until 2014. Since 2015, Samsung Smart TVs are distributed with a Samsung Smart Remote.




The Samsung Smart Remote has a "Play/Pause" key, and you must make sure your Tizen application handles its key clicks correctly. During media playback, clicking the "Play/Pause" key must pause playback, and clicking it while playback is paused must resume playback.


## Supporting Multitasking

Multitasking is supported by default on Samsung TVs using Tizen. Unlike in Samsung Legacy Platform, you do not need to configure multitasking in the "config.xml" file. However, you must register an event handler for visibility changes.

The `sendReturnEvent()`, `onPause()`, and `onResume()` methods are not used in Tizen:

- Before:



```javascript

```





Copy





LightDark

- After:



```javascript

```





Copy





LightDark


## Implementing Screensaver

In Samsung Legacy Platform, the application controlled the screensaver using the `setOnScreenSaver()` and `setOffScreenSaver()` methods. The screensaver functionality is handled by the Samsung Product API in Tizen:

- Before:



```javascript

```





Copy





LightDark

- After:



```javascript

```





Copy





LightDark


For more information, see [Setting Screensaver](https://developer.samsung.com/SmartTV/develop/guides/fundamentals/setting-screensaver.html).

## Playing Media

In Samsung Legacy Platform, media playback was implemented using a `plugin` object and the Player API. These are not supported in Tizen.

In Tizen, you can implement media playback in 2 different ways:

- Using the HTML5 `video` and `audio` elements




Common media formats can be played using the HTML5 `video` and `audio` elements. For more information, see [Using Video Elements](https://developer.samsung.com/SmartTV/develop/guides/multimedia/media-playback/using-video-elements.html) and [Using Audio Elements](https://developer.samsung.com/SmartTV/develop/guides/multimedia/media-playback/using-audio-elements.html).
- Using the [AVPlay API](https://developer.samsung.com/SmartTV/develop/api-references/samsung-product-api-references/avplay-api.html) from the Samsung Product API




The AVPlay API has additional features, such as support for DRM technologies and live streaming. For more information, see [Using AVPlay](https://developer.samsung.com/SmartTV/develop/guides/multimedia/media-playback/using-avplay.html).

To implement media playback with a `video` element:

- Player implementation:
  - Before:



    ```javascript

    ```





    Copy





    LightDark

  - After:



    ```javascript

    ```





    Copy





    LightDark
- Event handler implementation:
  - Before:



    ```javascript

    ```





    Copy





    LightDark

  - After:



    ```javascript

    ```





    Copy





    LightDark

## Accessing File System

Samsung Legacy Platform provided 2 file system APIs:

- The asynchronous Filesystem API of the WebAPI module
- The synchronous `FileSystem()` method of the Browser API

If you use the asynchronous Filesystem API, you do not need to make changes to the application logic. In Tizen, however, the [Filesystem API](https://developer.samsung.com/SmartTV/develop/api-references/tizen-web-device-api-references/filesystem-api.html) is no longer part of the WebAPI module but a Tizen API:

- Before:



```javascript

```





Copy





LightDark

- After:



```javascript

```





Copy





LightDark


Tizen does not provide a synchronous file system API. If you used the `FileSystem()` method, you must change your application implementation in one of the following ways:

- Adapt the application logic to use the file system asynchronously and use the Filesystem API:
  - Before:



    ```javascript

    ```





    Copy





    LightDark

  - After:



    ```javascript

    ```





    Copy





    LightDark
- If it is difficult to adapt the synchronous logic to asynchronous logic, you can use the Web standard [Web Storage API](http://www.w3.org/TR/2011/CR-webstorage-20111208/). For more information, see [Using Web Storage](https://developer.samsung.com/SmartTV/develop/guides/data-handling/using-web-storage.html).

**Important** The `localStorage` object has weak security, as other applications can also access the data. Always use a unique key value, and always encrypt security- or privacy-related data stored in the `localStorage` object.
  - Before:



    ```javascript

    ```





    Copy





    LightDark

  - After:



    ```javascript

    ```





    Copy





    LightDark

Open On This Page

# Manage Your Cookies

We use cookies to improve your experience on our website and to show you relevant
advertising. Manage you settings for our cookies below.

## Essential Cookies

These cookies are essential as they enable you to move around the website. This
category cannot be disabled.

View Cookies

CompanyDomainSamsung Electronicsdeveloper.samsung.com, .samsung.com

## Analytical/Performance Cookies

These cookies collect information about how you use our website. for example which
pages you visit most often. All information these cookies collect is used to improve
how the website works.

View Cookies

NOYES

CompanyDomainSamsung Electronics.samsung.com

## Functionality Cookies

These cookies allow our website to remember choices you make (such as your user name, language or the region your are in) and
tailor the website to provide enhanced features and content for you.

View Cookies

NOYES

CompanyDomainSamsung Electronicsdeveloper.samsung.com, google.account.samsung.com

# Preferences Submitted

You have successfully updated your cookie preferences.
