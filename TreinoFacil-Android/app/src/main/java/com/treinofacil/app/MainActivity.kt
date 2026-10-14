package com.treinofacil.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.KeyEvent
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.app.Activity

class MainActivity : Activity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true // localStorage (login, ficha, plano)
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.javaScriptCanOpenWindowsAutomatically = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        val cookieManager = android.webkit.CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                view?.evaluateJavascript("window.__ANDROID__ = true;", null)
            }
            override fun shouldOverrideUrlLoading(view: WebView?, request: android.webkit.WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                if (url.contains("youtube.com") || url.contains("youtu.be")) {
                    try {
                        startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url)))
                    } catch (e: Exception) {
                        view?.loadUrl(url)
                    }
                    return true
                }
                return false
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            private var customView: android.view.View? = null
            private var customViewCallback: CustomViewCallback? = null

            override fun onShowCustomView(view: android.view.View?, callback: CustomViewCallback?) {
                customView = view
                customViewCallback = callback
                customView?.let {
                    (window.decorView as android.view.ViewGroup).addView(it)
                    it.systemUiVisibility = android.view.View.SYSTEM_UI_FLAG_FULLSCREEN or
                        android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                        android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                }
            }

            override fun onHideCustomView() {
                customView?.let { (window.decorView as android.view.ViewGroup).removeView(it) }
                customView = null
                customViewCallback?.onCustomViewHidden()
                customViewCallback = null
                window.decorView.systemUiVisibility = android.view.View.SYSTEM_UI_FLAG_VISIBLE
            }
        }
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    // Botão de voltar do Android navega no WebView quando possível
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }
}
