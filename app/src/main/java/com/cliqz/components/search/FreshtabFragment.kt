
package com.cliqz.components.search

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomnavigation.BottomNavigationView
import kotlinx.android.synthetic.main.fragment_freshtab.*
import mozilla.components.support.base.feature.BackHandler
import mozilla.components.support.base.feature.ViewBoundFeatureWrapper

import org.mozilla.reference.browser.R
import org.mozilla.reference.browser.browser.BrowserFragment
import org.mozilla.reference.browser.browser.ToolbarIntegration
import org.mozilla.reference.browser.ext.requireComponents

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [FreshtabFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [FreshtabFragment.newInstance] factory method to
 * create an instance of this fragment.
 *
 */
class FreshtabFragment : Fragment(), BackHandler {
    // TODO: Rename and change types of parameters
//    private var param1: String? = null
//    private var param2: String? = null
//    private var listener: OnFragmentInteractionListener? = null
    private val toolbarIntegration = ViewBoundFeatureWrapper<ToolbarIntegration>()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_freshtab, container, false)
    }

    private val onNavigationItemSelectedListener = BottomNavigationView.OnNavigationItemSelectedListener { item ->
        when (item.itemId) {
            R.id.navigation_home -> {
//                textMessage.setText(R.string.title_home)
                Log.d("NAV", "Click Home")
                requireComponents.cliqz.sendEvent("FRESHTAB:SHOW_HOME")
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_tabs -> {
//                textMessage.setText(R.string.title_dashboard)
                Log.d("NAV", "Click Dashboard")
                requireComponents.cliqz.sendEvent("FRESHTAB:SHOW_TABS")
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_history -> {
//                textMessage.setText(R.string.title_notifications)
                Log.d("NAV", "Click Notifications")
                requireComponents.cliqz.sendEvent("FRESHTAB:SHOW_HOME")
                return@OnNavigationItemSelectedListener true
            }
        }
        false
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val navView: BottomNavigationView = nav_view

//        textMessage = findViewById(R.id.message)
        navView.setOnNavigationItemSelectedListener(onNavigationItemSelectedListener)
        navView.selectedItemId = R.id.navigation_tabs
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment FreshtabFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
                FreshtabFragment().apply {
                    arguments = Bundle().apply {
                        putString(ARG_PARAM1, param1)
                        putString(ARG_PARAM2, param2)
                    }
                }
    }

    override fun onBackPressed(): Boolean {
        activity?.supportFragmentManager?.beginTransaction()?.apply {
            replace(R.id.container, BrowserFragment())
            commit()
        }
        return true
    }
}
