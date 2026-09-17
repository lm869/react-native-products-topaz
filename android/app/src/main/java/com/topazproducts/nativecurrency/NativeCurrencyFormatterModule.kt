package com.topazproducts.nativecurrency

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

class NativeCurrencyFormatterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = MODULE_NAME

  @ReactMethod
  fun format(amount: Double, currencyCode: String, locale: String, promise: Promise) {
    try {
      val safeAmount = if (amount.isFinite()) amount else 0.0
      val tag = locale.ifBlank { Locale.US.toLanguageTag() }
      val localeInstance = Locale.forLanguageTag(tag)
      val currencyInstance = Currency.getInstance(currencyCode)
      val formatter = NumberFormat.getCurrencyInstance(localeInstance)
      formatter.currency = currencyInstance
      promise.resolve(formatter.format(safeAmount))
    } catch (e: IllegalArgumentException) {
      promise.reject(E_FORMAT, "Invalid currency or locale", e)
    } catch (e: Exception) {
      promise.reject(E_FORMAT, e.message ?: "format failed", e)
    }
  }

  companion object {
    const val MODULE_NAME = "NativeCurrencyFormatter"
    private const val E_FORMAT = "E_FORMAT"
  }
}