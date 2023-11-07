#import <Firebase.h>
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTConvert.h>

#import <FBSDKCoreKit/FBSDKCoreKit-swift.h>
#import <RNCPushNotificationIOS.h>
#import <RNSplashScreen.h>
#import <TuyaSmartHomeKit/TuyaSmartKit.h>
#import <UserNotifications/UserNotifications.h>
#import <React/RCTLinkingManager.h>

// #ifdef FB_SONARKIT_ENABLED
// #import <FlipperKit/FlipperClient.h>
// #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
// #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
// #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
// #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
// #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

// static void InitializeFlipper(UIApplication *application) {
//   FlipperClient *client = [FlipperClient sharedClient];
//   SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
//   [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
//   [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
//   [client addPlugin:[FlipperKitReactPlugin new]];
//   [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
//   [client start];
// }
// #endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"main" initialProperties:nil];
  id rootViewBackgroundColor = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"RCTRootViewBackgroundColor"];
  if (rootViewBackgroundColor != nil) {
    rootView.backgroundColor = [RCTConvert UIColor:rootViewBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }
  
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // #ifdef FB_SONARKIT_ENABLED
  //   InitializeFlipper(application);
  // #endif

  #ifdef DEBUG
    [[TuyaSmartSDK sharedInstance] setDebugMode:YES];
  #endif

  [[TuyaSmartSDK sharedInstance] startWithAppKey:@"8dtgsm7qhk8dhxvwwtgj" secretKey:@"7ktdrydnrjjfsvtu4nkwqdm44xcstjx4"];

  // self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  // UIViewController *rootViewController = [UIViewController new];
  // rootViewController.view.backgroundColor = UIColor.redColor;
  // self.window.rootViewController = rootViewController;
  // [self.window makeKeyAndVisible];

  // UIViewController *rootViewController = [self.reactDelegate createRootViewController];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // UIView* launchScreenView = [[[NSBundle mainBundle] loadNibNamed:@"index" owner:self options:nil] objectAtIndex:0];
  // launchScreenView.frame = self.window.bounds;
  // rootView.loadingView = launchScreenView;
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  [RNSplashScreen show];
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];

  return YES;
}
// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
//   self.moduleName = @"main";

//   // You can add your custom initial props in the dictionary below.
//   // They will be passed down to the ViewController used by React Native.

//   self.initialProps = @{};


//   #ifdef DEBUG
//     [[TuyaSmartSDK sharedInstance] setDebugMode:YES];
//   #endif

//   [[TuyaSmartSDK sharedInstance] startWithAppKey:@"8dtgsm7qhk8dhxvwwtgj" secretKey:@"7ktdrydnrjjfsvtu4nkwqdm44xcstjx4"];

//   [[FBSDKApplicationDelegate sharedInstance] application:application
//                        didFinishLaunchingWithOptions:launchOptions];

//    // Define UNUserNotificationCenter
//   UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//   center.delegate = self;

//   return YES;
//   return [super application:application didFinishLaunchingWithOptions:launchOptions];
// }

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

// Linking API
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  BOOL result = [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [super application:application continueUserActivity:userActivity restorationHandler:restorationHandler] || result;
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

@end
