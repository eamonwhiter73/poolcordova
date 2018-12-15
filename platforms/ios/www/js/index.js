/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var pool = null;
var tabbar = null;
var share = null;
var signin = null;
var user = null;
var currentPoolId = null;

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    apiKey: "AIzaSyAKDvrOB3Fi8-4V5xGHtD546WYqcT1Vbek",
    authDomain: "pool-3f2de.firebaseapp.com",
    databaseURL: "https://pool-3f2de.firebaseio.com",
    projectId: "pool-3f2de",
    storageBucket: "pool-3f2de.appspot.com",
    messagingSenderId: "843791335284",
};

firebase.initializeApp(config);

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

        Array.prototype.insert = function ( index, item ) {
            this.splice( index, 0, item );
        };

        universalLinks.subscribe(null, function (eventData) {
          // do some work
            console.log('Did launch application from the link: ' + eventData.url);
        });

        tabbar = new Tabbar();
        tabbar.initialize().then(function() {
            pool = new Pool();
            pool.initialize().then(function() {
                share = new Share();
                share.initialize().then(function() {
                    signin = new SignIn();
                    signin.initialize();
                });
            });
        });
    }
};

app.initialize();