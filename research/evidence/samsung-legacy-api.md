# API References

## Archive

You can download Samsung Legacy Platform API reference documents here.

Legacy Platform API Documents
_(8.23MB)_

## Application API

While a developer creates a Samsung Smart TV app and Javascript function can not support functions such as volume control or channel change, Application, an API supported by Samsung engine, enable to use the functions with method call easily.

Application API Type lists a variety of functions for Samsung Smart TV App.

This API is defined as Class, and each Class consists of methods, function, Property etc.

| **Feature** | **Class** |
| --- | --- |
| Service | sf.service |
| sf.service.SmartRemote |
| Storage | sf.service.USB |
| TV Control | AppCommon |
| filesystem |
| filesystem.file |
| NNavi |
| TaskManager |
| TV |
| tv.channel |
| tv.info |
| tv.window |
| Window |
| Framework | Date |
| Number |
| sf.core |
| sf.env |
| sf.key |
| sf.scene |
| sf.util |
| String |
| WebAPIs | AttributeFilter |
| AttributeRangeFilter |
| CompositeFilter |
| SimpleCoordinates |
| SortMode |

## UI API

User Interface defines necessary UI elements for TV app development supported by Samsung Smart TV.

| **Feature** | **Class** |
| --- | --- |
| ImageViewer | imageview |
| sf.service.ImageViewer |
| UI Component | sf.ui |
| sf.ui.widget |
| sfArrowButton |
| sfBackground |
| sfButton |
| sfCheckBox |
| sfDatepicker |
| sfHScroll |
| sfImage |
| sfKeyHelp |
| sfLabel |
| sfList |
| sfLoading |
| sfMaps |
| sfPageIndicator |
| sfPopup |
| sfProgressBar |
| sfScroll |
| sfSlider |
| sfTextInput |
| sfTextList |
| sfTitleBar |
| sfToggleButton |
| sfTooltip |
| sfWizard |

## Display API

With Display API, everyone can use and control contents on Samsung SMART TV's big screen. For instance, social media, apps, multimedia can be on the screen with a remote control's smart hub button.

Using social media, users can enjoy popular contents through YouTube, video calls through Skype and show what their friends like on the screen using Samsung or Facebook account log-in.

In Samsung Apps store, various contents are categorized into several groups such as Video, Game, Sports, Life style, Information and Education etc., and users can check how to use Display. It provides promotion display through ads. When a user enjoys films, videos, music, TV re-run, they can put images on the screen using Allshare and USB and apps. Moreover, users can enjoy web surfing, watching TV ,and they can put subtitles on the screen. If it supports 3D technologies, it provides a 3D video. Finally, it can re-adjust TV's , video's or images' size and position.

| **Feature** | **Class** |
| --- | --- |
| 3D | displaycontrol |
| Screen |
| sf.env |
| Closed Caption | tv.closedcaption |
| PIG | sf.service.PIG |

## Hardware API

Hardware API provides API controlling, inputting and outputting Samsung Smart TV's internal and external devices.

Hardware APIs supported by Samsung Smart TV are Camera, External Interworking, Network, Remote Control, Customdevice, Gamepad, HealthcareDevice, MIDI, Nservice, SmartHome and Microphone.

Camera API can be used for functions related to video call, Nservice and SmartHome are Network-based APIs. Here, Nservice API is a concept of bi-directional communication in the same network, and SmartHome API , connected with network, provides functions controlling electronic devices produced by Samsung.

Network API connects internet to Samsung Smart TV and enable users to enjoy a variety of contents, receive updated news and download several apps and information.

Gamepad API provides functions that users can control a device inputting Gamepad's key with their fingers.

Microphone API enables to use a microphone's information, device's name, microphone's volume and effects supported by a microphone (ex.echo). This API can used for hardware- related app. Each API defines Class and how to use.

| **Feature** | **Class** |
| --- | --- |
| Camera | camera |
| External Interworking | customdevice |
| customdevice.CustomDevice |
| FrontPanel |
| gamepad |
| gamepad.Gamepad |
| healthcaredevice |
| healthcaredevice.HealthcareDevice |
| mediasharing.MediaProviderDiscoveryCallback |
| mediasharing.mediaproviderfinder |
| microphone |
| microphone.Microphone |
| multiscreen.Channel |
| multiscreen.ChannelClient |
| multiscreen.Device |
| printer |
| SmartHome |
| Network | network |
| Remote Control | AppCommon |
| MIDI | MIDIDevice |
| Nservice | Nservice |

## Media API

Media API is API controlling media contents such as video/audio.

This API's core purpose is allowing users to use media contents effectively in Samsung smart TV App. Functions provided by Media API perform. Media API includes AVFunction which defines functions related to AVplay, Audio Control controlling audio through webapis.audiocontrol object, and Player controlling video/audio.

Moreover, Sound defines volume control functions using deviceapis.audiocontrol object, is contained in Media API. Media API's core function is, as mentioned above, is controlling media contents. Through Media API, contents' Play, Pause, Stop, Fast Forward, Fast Reward, Mute, and Volume up / down functions can be performed. Also, Media API can adjust contents' size, bring and control DTV platform's volume information and handle a streaming function. Additionally, it can show AV setting pop-up using sf.service.AVSetting class.

| **Feature** | **Class** |
| --- | --- |
| AV Function | avplay |
| AVPlay |
| sf.service.AVSetting |
| Player | avplay |
| Player |
| sf.service.VideoPlayer |
| sf.service.VideoPlayer.Skip |
| Sound | Audio |
| audiocontrol |
| sf.service.AudioPlayer |
| sf.service.AudioPlayer.Skip |

## Recognition API

Recognition API controls Samsung Smart TV with gestures and voice recognition.

Recognition API's core purpose is controlling TV apps in various ways (not only with a remote control)

Recognition API contains 'Gesture API' controlling Samsung Smart TV and 'Voice recognition API 'supporting voice recognition. Gesture controls Samsung Smart TV by synchronizing users' motions and the motion already defined in Samsung Smart TV. Voice recognition controls Samsung Smart TV sending users' voice to an external server and receiving the text-formed output.

Recognition's core function is checking if recognition can be supported, setting Gesture's or Voice Recognition's event and controlling Samsung Smart TV APP. Through IsRecognitionSupported()/Is GestureRecognitionEnabled()/Is VoiceRecognitionEnabled(), developers can check if recognition can be supported.

Moreover, event setting is performed through SubscribeEvent() functionExEvent()function. Recognition API's functions, mentioned above, are performed through webapis.recognition object. In the case of Gesture, developers need to revise config.xml to support a mouse. If they want to develop an app controlling Samsung Smart TV, they can use recognition API.

| **Feature** | **Class** |
| --- | --- |
| Gesture | recognition |
| Recognition Common | recognition |
| Voice Recognition | recognition |

## CAPH API

Caph Framework, also known as caph.js, it includes all kinds of Caph WUI Widgets and Animations & Effect, Caph WUI Engine, Data Acceleration library.

Caph WUI Widgets are the basic widgets such as Label, Navigator, GridWidget, ListWidget, Image and so on. They are the widget template for creating new web application.

Caph WUI Animations & Effect are main support high performance animation and effect based on Smart TV Motion Guide, including fade, transfer, rotate, scale, bounce, flip animation effect and so on.

The function of caph WUI Engine is to manage hierarchical structure for UI, manage event and manage graphics acceleration. The function of Data Acceleration library is high level API for response time optimization. All the parts above mentioned are Caph Framework for high performance Web applications.

| **Feature** | **Class** |
| --- | --- |
| Animation | caph.core.effect |
| caph.wui.ani.AniFactory |
| caph.wui.ani.AniLoader |
| caph.wui.ani.BaseAnimation |
| caph.wui.ani.BounceAnimation |
| caph.wui.ani.FadeAnimation |
| caph.wui.ani.GroupAutoFlipAnimation |
| caph.wui.ani.RotateAnimation |
| caph.wui.ani.ScaleAnimation |
| caph.wui.ani.ScaleBounceAnimation |
| caph.wui.ani.SyncAnimation |
| caph.wui.ani.TransferAnimation |
| caph.wui.engine.tween.Animator |
| caph.wui.engine.tween.Layer |
| caph.wui.engine.tween.Timeline |
| Data Cache | caph.dal.BaseCache |
| caph.dal.LocalStorageCache |
| Data Loader | caph.dal.BaseLoader |
| caph.dal.EventHandler |
| caph.dal.Preloader |
| caph.dal.TagLoader |
| caph.dal.XHRLoader |
| Device Info | caph.platform.dtv.Browser |
| caph.platform.dtv.Device |
| Event Handler | caph.app.event.EngineEventHandler |
| caph.app.event.PerfEventHandler |
| Framework | caph |
| caph.core |
| caph.Lang |
| caph.misc |
| caph.misc.Time |
| Rendering Core | caph.wui.engine.rendering.AmbientLight |
| caph.wui.engine.rendering.AreaLight |
| caph.wui.engine.rendering.BasePage |
| caph.wui.engine.rendering.BasicMaterial |
| caph.wui.engine.rendering.CanvasRenderer |
| caph.wui.engine.rendering.CommonObject |
| caph.wui.engine.rendering.CssObject |
| caph.wui.engine.rendering.CssRenderer |
| caph.wui.engine.rendering.CubeGeometry |
| caph.wui.engine.rendering.DirectionalLight |
| caph.wui.engine.rendering.HemisphereLight |
| caph.wui.engine.rendering.LambertMaterial |
| caph.wui.engine.rendering.Mesh3d |
| caph.wui.engine.rendering.PhongMaterial |
| caph.wui.engine.rendering.PlaneGeometry |
| caph.wui.engine.rendering.PointLight |
| caph.wui.engine.rendering.SphereGeometry |
| caph.wui.engine.rendering.SpotLight |
| caph.wui.engine.rendering.Texture |
| caph.wui.engine.rendering.WebglRenderer |
| UI Component | caph.wui.widget.BasicObject |
| caph.wui.widget.Book |
| caph.wui.widget.Box |
| caph.wui.widget.Button |
| caph.wui.widget.Carousel |
| caph.wui.widget.ColorTag |
| caph.wui.widget.Dom |
| caph.wui.widget.DomContainer |
| caph.wui.widget.GridWidget |
| caph.wui.widget.HighlightHelper |
| caph.wui.widget.Image |
| caph.wui.widget.ImageGallery |
| caph.wui.widget.InputBox |
| caph.wui.widget.KeyControl |
| caph.wui.widget.Label |
| caph.wui.widget.ListWidget |
| caph.wui.widget.Navigator |
| caph.wui.widget.Panel |
| caph.wui.widget.ProgressBar |
| caph.wui.widget.Scene |
| caph.wui.widget.SceneManager |
| caph.wui.widget.Sidebar |
| caph.wui.widget.Spinner |
| caph.wui.widget.Strip |
| caph.wui.widget.ThemeMgr |
| caph.wui.widget.UIContext |
| caph.wui.widget.View |
| caph.wui.widget.WidgetError |
| Widget Engine | caph.platform.dtv.Widget |
| i18n | caph.config.i18n |
| caph.i18n.language |

## Pepper API

- Pepper API Reference 2013
- Pepper API Reference 2014

## AllShare API

- AllShare API Reference (ASF 1.5)
- AllShare API Reference (ASF 0.4)

## File API

File API enables applications to use the file input/output system supported by the Samsung TV application engine to store data they get while they are still working, and restore the data anytime they want. All applications perform file input/output operations in a common area. Files used in different applications may have the same name. To prevent problems due to this, a directory using application ID (curWidget.id) must be created, and the file in this directory is used. If multiple applications need to share data, they do it through a file path that they share.

File input/output operations are performed by creating a file system object and calling the interface of the object.

| **Feature** | **Class** |
| --- | --- |
| File | closeCommonFile |
| createCommonDir |
| deleteCommonDir |
| deleteCommonFile |
| Filesystem |
| isValidCommonPath |
| openCommonFile |
| openFile |
| readAll |
| readDir |
| readLine |
| writeAll |
| writeLine |

## Convergence App API

The convergence framework provides a REST-based interface allowing devices supporting the HTTP protocol to communicate with a Smart TV. Devices discover Samsung TVs on the local network using the UPnP discovery.

For more information on the convergence application features, see Convergence App.

For developing TV application we can use NService.

- Client(HHP)to TV Application Communication

| **Feature** | **Class** |
| --- | --- |
| Convergence App | Client(HHP)to TV Application Communication |
| Constants |
| Manager Event |
| NService |
| NService Device |
| NService Device Event Info |
| NService Device Group Info |
| NService Device Manager |
| NService Device Message Info |

## Common Modules API

The Application Manager provides some common object modules that all your applications can use. These common modules enable your applications to run normally on the screen. Also, using common modules, individual applications can recognize and identify remote control button events, use plugins, and communicate with the Application Manager in a convenient and simple way.

| **Feature** | **Class** |
| --- | --- |
| Common Modules | CImageViewer Module |
| Common popup IME |
| Effect Object |
| IMECN Module |
| IME Module |
| Plugin Objects |
| SSO Module |
| Transition Effects |
| TVKeyValue Object |
| Widget Object |

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
