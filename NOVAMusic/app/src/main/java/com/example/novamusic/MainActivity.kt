package com.example.novamusic

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.net.URL
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {

    private var webView: WebView? = null
    private val executor = Executors.newSingleThreadExecutor()

    private val appUrl =
        "https://bnmisac12w-coder.github.io/Nova-music-link/"

    private val versionUrl =
        "https://bnmisac12w-coder.github.io/Nova-music-link/version.json"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkForUpdate(savedInstanceState)
    }

    private fun checkForUpdate(savedInstanceState: Bundle?) {
        executor.execute {
            var updateUrl: String? = null

            try {
                val connection = URL(versionUrl).openConnection() as java.net.HttpURLConnection
                connection.connectTimeout = 5000
                connection.readTimeout = 5000
                connection.setRequestProperty("Cache-Control", "no-cache")

                val json = connection.getInputStream()
                    .bufferedReader()
                    .use { it.readText() }

                val data = JSONObject(json)
                val latestCode = data.getInt("versionCode")

                val currentCode = packageManager.getPackageInfo(packageName, 0).longVersionCode
                if (latestCode > currentCode) {
                    updateUrl = data.getString("downloadPage")
                }
                connection.disconnect()
            } catch (e: Exception) {
                android.util.Log.e("NOVA_UPDATE", "Sürüm kontrolü başarısız", e)
            }

            runOnUiThread {
                if (!updateUrl.isNullOrBlank()) {
                    val intent = Intent(
                        Intent.ACTION_VIEW,
                        Uri.parse(updateUrl)
                    )
                    startActivity(intent)
                    finish()
                } else {
                    openMusic(savedInstanceState)
                }
            }
        }
    }

    private fun openMusic(savedInstanceState: Bundle?) {
        webView = WebView(this)
        setContentView(webView)

        webView?.settings?.javaScriptEnabled = true
        webView?.settings?.domStorageEnabled = true
        webView?.settings?.mediaPlaybackRequiresUserGesture = false

        webView?.webViewClient = WebViewClient()
        webView?.webChromeClient = WebChromeClient()

        if (savedInstanceState == null) {
            webView?.loadUrl(appUrl)
        } else {
            webView?.restoreState(savedInstanceState)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView?.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (webView?.canGoBack() == true) {
            webView?.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        webView?.destroy()
        executor.shutdownNow()
        super.onDestroy()
    }
}
