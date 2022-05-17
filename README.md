# VetBook app develop-----------------

1.create project----- 
    npx react-native init PetBook then copy src, App.js, index.js, package.json, react-native.config.js to root folder of project

2.copy mipmap-hdpi folders in android/app/main/res

3.paste in android/app/build.gradle ------- 
    apply plugin: "com.google.gms.google-services"
    1.within dependency paste---- 	
    implementation 'com.google.firebase:firebase-appcheck-safetynet:16.0.0-beta06'
    implementation 'com.google.firebase:firebase-bom:29.2.1'
	implementation 'com.google.firebase:firebase-analytics'
4.paste in android/build.gradle -------- 
    classpath('com.google. gms:google-services:4.3.10')

5.paste within application xml tag(path: adroid/app/main/androidmanifest.xml)
     <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="API_KEY"/>

        
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" >

    <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>

    <application
      android:requestLegacyExternalStorage="true"
    

6.set up firebase project follow https://www.youtube.com/watch?v=_msNczBgHUE

7.run this command 
    (keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000) in android/app
    if keytool is not recognized check variable path
    1.Edit system enviironment options
    2.cross check java bin path, it should be C:\Program Files\Java\jdk-11.0.13\bin
    3. to check debug key run ---- keytool -list -v -keystore debug.keystore
    4. Firebase app debug token ------ 968BD86C-6684-4FB7-8F7C-64C6CCBB0567

8.copy google-services.json in android/app

9.npm install --legacy-peer-deps if you have peer dependency, otherwise do ----- npm i

10.npx react-native link

11.change app name in string.xml path is android/app/src/main/res/values/string.xml

12.npx react-native run-android