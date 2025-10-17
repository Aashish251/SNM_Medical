(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/api.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const API_BASE_URL = 'http://localhost:5000/api';
class ApiService {
    constructor(){
        this.baseURL = API_BASE_URL;
    }
    getToken() {
        if ("TURBOPACK compile-time truthy", 1) {
            return localStorage.getItem('token');
        }
        "TURBOPACK unreachable";
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...token && {
                    Authorization: `Bearer ${token}`
                },
                ...options.headers
            },
            ...options
        };
        /* eslint-disable */ console.log(...oo_oo(`338991454_28_4_28_46_4`, 'Making API request to:', url));
        /* eslint-disable */ console.log(...oo_oo(`338991454_29_4_29_42_4`, 'Request config:', config));
        try {
            const response = await fetch(url, config);
            /* eslint-disable */ console.log(...oo_oo(`338991454_34_6_34_54_4`, 'Response status:', response.status));
            /* eslint-disable */ console.log(...oo_oo(`338991454_35_6_35_56_4`, 'Response headers:', response.headers));
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                /* eslint-disable */ console.error(...oo_tx(`338991454_41_8_41_49_11`, 'Non-JSON response:', text));
                throw new Error(`Server returned non-JSON response: ${text}`);
            }
            const data = await response.json();
            /* eslint-disable */ console.log(...oo_oo(`338991454_46_6_46_41_4`, 'Response data:', data));
            if (!response.ok) {
                /* eslint-disable */ console.error(...oo_tx(`338991454_49_8_49_50_11`, 'API Error Response:', data));
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            return data;
        } catch (error) {
            /* eslint-disable */ console.error(...oo_tx(`338991454_55_6_55_49_11`, 'API request failed:', error));
            // Provide more specific error messages
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Make sure backend is running on port 5000.');
            }
            throw error;
        }
    }
    // ==================== AUTH ENDPOINTS ====================
    async login(credentials) {
        /* eslint-disable */ console.log(...oo_oo(`338991454_68_4_68_46_4`, 'Login request:', credentials));
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }
    async logout() {
        // Clear local storage
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        }
        return Promise.resolve({
            success: true
        });
    }
    // ==================== REGISTRATION ENDPOINTS ====================
    async getRegistrationDropdownData() {
        try {
            /* eslint-disable */ console.log(...oo_oo(`338991454_88_4_88_57_4`, 'Fetching registration dropdown data...'));
            const response = await this.request('/registration/dropdown-data');
            // Ensure we always return the expected structure
            return {
                success: response.success || false,
                data: {
                    states: response.data?.states || [],
                    cities: response.data?.cities || [],
                    departments: response.data?.departments || [],
                    qualifications: response.data?.qualifications || []
                }
            };
        } catch (error) {
            /* eslint-disable */ console.error(...oo_tx(`338991454_102_4_102_58_11`, 'Failed to fetch dropdown data:', error));
            // Return safe fallback structure
            return {
                success: false,
                data: {
                    states: [],
                    cities: [],
                    departments: [],
                    qualifications: []
                },
                error: error.message
            };
        }
    }
    async getCitiesByState(stateId) {
        /* eslint-disable */ console.log(...oo_oo(`338991454_119_4_119_54_4`, 'Fetching cities for state:', stateId));
        return this.request(`/registration/cities/${stateId}`);
    }
    async checkEmailAvailability(email) {
        /* eslint-disable */ console.log(...oo_oo(`338991454_124_4_124_54_4`, 'Checking email availability:', email));
        return this.request('/registration/check-email', {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        });
    }
    async registerUser(userData) {
        /* eslint-disable */ console.log(...oo_oo(`338991454_132_4_132_50_4`, 'Registration request:', userData));
        return this.request('/registration/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    async getRegistrationStats() {
        return this.request('/registration/stats');
    }
    // ==================== DASHBOARD ENDPOINTS ====================
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }
    async getUserProfile() {
        return this.request('/dashboard/profile');
    }
    async updateUserProfile(profileData) {
        return this.request('/dashboard/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
    async uploadProfileImage(formData) {
        // Note: For file uploads, we don't set Content-Type header
        const token = this.getToken();
        const url = `${this.baseURL}/dashboard/profile/image`;
        /* eslint-disable */ console.log(...oo_oo(`338991454_164_4_164_51_4`, 'Uploading profile image to:', url));
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...token && {
                        Authorization: `Bearer ${token}`
                    }
                },
                body: formData
            });
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                /* eslint-disable */ console.error(...oo_tx(`338991454_179_8_179_49_11`, 'Non-JSON response:', text));
                throw new Error(`Server returned non-JSON response: ${text}`);
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'File upload failed');
            }
            return data;
        } catch (error) {
            /* eslint-disable */ console.error(...oo_tx(`338991454_191_6_191_49_11`, 'File upload failed:', error));
            throw error;
        }
    }
    // ==================== USER MANAGEMENT ENDPOINTS ====================
    async getAllUsers(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/dashboard/users${queryParams ? `?${queryParams}` : ''}`;
        return this.request(endpoint);
    }
    async getUserById(userId) {
        return this.request(`/dashboard/users/${userId}`);
    }
    async updateUser(userId, userData) {
        return this.request(`/dashboard/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }
    async deleteUser(userId) {
        return this.request(`/dashboard/users/${userId}`, {
            method: 'DELETE'
        });
    }
    // ==================== MASTER DATA ENDPOINTS ====================
    async getStates() {
        return this.request('/master/states');
    }
    async getCitiesByStateId(stateId) {
        return this.request(`/master/cities/${stateId}`);
    }
    async getDepartments() {
        return this.request('/master/departments');
    }
    async getQualifications() {
        return this.request('/master/qualifications');
    }
    // ==================== REPORTS ENDPOINTS ====================
    async getDailyReport(date) {
        return this.request(`/reports/daily?date=${date}`);
    }
    async getRegistrationReport(startDate, endDate) {
        return this.request(`/reports/registration?startDate=${startDate}&endDate=${endDate}`);
    }
    async getMasterReport(type) {
        return this.request(`/reports/master?type=${type}`);
    }
    // ==================== UTILITY METHODS ====================
    async testConnection() {
        return this.request('/auth/test');
    }
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            /* eslint-disable */ console.error(...oo_tx(`338991454_261_6_261_50_11`, 'Health check failed:', error));
            throw new Error('Server is not responding');
        }
    }
    async databaseHealthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health/db`);
            const data = await response.json();
            return data;
        } catch (error) {
            /* eslint-disable */ console.error(...oo_tx(`338991454_272_6_272_59_11`, 'Database health check failed:', error));
            throw new Error('Database connection failed');
        }
    }
    // ==================== AUTHENTICATION HELPERS ====================
    isAuthenticated() {
        return !!this.getToken();
    }
    getCurrentUser() {
        if ("TURBOPACK compile-time truthy", 1) {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        "TURBOPACK unreachable";
    }
    getCurrentUserRole() {
        if ("TURBOPACK compile-time truthy", 1) {
            return localStorage.getItem('role');
        }
        "TURBOPACK unreachable";
    }
    // ==================== ERROR HANDLING HELPERS ====================
    handleAuthError() {
        // Clear invalid tokens
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        }
        // Redirect to login (you might want to handle this in your components)
        if ("TURBOPACK compile-time truthy", 1) {
            window.location.href = '/login';
        }
    }
}
const __TURBOPACK__default__export__ = new ApiService();
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ ;
function oo_cm() {
    try {
        return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x206025=_0x8070;(function(_0x1e0ee3,_0x543f60){var _0x2c6461=_0x8070,_0x2eeeae=_0x1e0ee3();while(!![]){try{var _0x19568b=parseInt(_0x2c6461(0xd6))/0x1+-parseInt(_0x2c6461(0xf9))/0x2+-parseInt(_0x2c6461(0x13a))/0x3*(-parseInt(_0x2c6461(0xd8))/0x4)+-parseInt(_0x2c6461(0xef))/0x5*(parseInt(_0x2c6461(0x19d))/0x6)+-parseInt(_0x2c6461(0x16c))/0x7*(parseInt(_0x2c6461(0x129))/0x8)+parseInt(_0x2c6461(0x195))/0x9*(-parseInt(_0x2c6461(0x190))/0xa)+parseInt(_0x2c6461(0x162))/0xb;if(_0x19568b===_0x543f60)break;else _0x2eeeae['push'](_0x2eeeae['shift']());}catch(_0x5c8bf4){_0x2eeeae['push'](_0x2eeeae['shift']());}}}(_0x1f2e,0x1d68a));function x(_0x16bd66,_0x4a4d60,_0xbaf7ae,_0x5726d8,_0x14c677,_0x58be02){var _0x412efa=_0x8070,_0x579420,_0x30350e,_0x41aee7,_0x13ee33;this['global']=_0x16bd66,this[_0x412efa(0x167)]=_0x4a4d60,this['port']=_0xbaf7ae,this['nodeModules']=_0x5726d8,this[_0x412efa(0x1a3)]=_0x14c677,this[_0x412efa(0x191)]=_0x58be02,this[_0x412efa(0xe8)]=!0x0,this[_0x412efa(0x101)]=!0x0,this[_0x412efa(0x169)]=!0x1,this[_0x412efa(0xb1)]=!0x1,this[_0x412efa(0x18f)]=((_0x30350e=(_0x579420=_0x16bd66[_0x412efa(0x128)])==null?void 0x0:_0x579420[_0x412efa(0xa5)])==null?void 0x0:_0x30350e['NEXT_RUNTIME'])==='edge',this[_0x412efa(0xfd)]=!((_0x13ee33=(_0x41aee7=this['global'][_0x412efa(0x128)])==null?void 0x0:_0x41aee7['versions'])!=null&&_0x13ee33[_0x412efa(0xd4)])&&!this[_0x412efa(0x18f)],this[_0x412efa(0xbe)]=null,this['_connectAttemptCount']=0x0,this[_0x412efa(0x150)]=0x14,this[_0x412efa(0x183)]=_0x412efa(0x107),this['_sendErrorMessage']=(this['_inBrowser']?_0x412efa(0xc5):_0x412efa(0x189))+this[_0x412efa(0x183)];}x[_0x206025(0xa3)][_0x206025(0x165)]=async function(){var _0xe87ea2=_0x206025,_0x3ecbb7,_0x2e6871;if(this[_0xe87ea2(0xbe)])return this[_0xe87ea2(0xbe)];let _0x2b5713;if(this['_inBrowser']||this['_inNextEdge'])_0x2b5713=this[_0xe87ea2(0x198)][_0xe87ea2(0xd7)];else{if((_0x3ecbb7=this[_0xe87ea2(0x198)][_0xe87ea2(0x128)])!=null&&_0x3ecbb7[_0xe87ea2(0xc4)])_0x2b5713=(_0x2e6871=this['global'][_0xe87ea2(0x128)])==null?void 0x0:_0x2e6871['_WebSocket'];else try{_0x2b5713=(await new Function('path',_0xe87ea2(0xbb),'nodeModules',_0xe87ea2(0xd3))(await(0x0,eval)(_0xe87ea2(0x16e)),await(0x0,eval)(_0xe87ea2(0xa4)),this[_0xe87ea2(0x109)]))['default'];}catch{try{_0x2b5713=require(require(_0xe87ea2(0x103))[_0xe87ea2(0x126)](this['nodeModules'],'ws'));}catch{throw new Error(_0xe87ea2(0x111));}}}return this[_0xe87ea2(0xbe)]=_0x2b5713,_0x2b5713;},x[_0x206025(0xa3)][_0x206025(0x16a)]=function(){var _0x1cde0f=_0x206025;this[_0x1cde0f(0xb1)]||this[_0x1cde0f(0x169)]||this[_0x1cde0f(0x187)]>=this[_0x1cde0f(0x150)]||(this['_allowedToConnectOnSend']=!0x1,this[_0x1cde0f(0xb1)]=!0x0,this[_0x1cde0f(0x187)]++,this['_ws']=new Promise((_0x91bb92,_0x1b6bd1)=>{var _0x37f025=_0x1cde0f;this[_0x37f025(0x165)]()[_0x37f025(0xd5)](_0x19bb6e=>{var _0x17676c=_0x37f025;let _0x45d49b=new _0x19bb6e(_0x17676c(0xfb)+(!this[_0x17676c(0xfd)]&&this[_0x17676c(0x1a3)]?_0x17676c(0x157):this[_0x17676c(0x167)])+':'+this[_0x17676c(0xdc)]);_0x45d49b[_0x17676c(0x14b)]=()=>{var _0x550b85=_0x17676c;this[_0x550b85(0xe8)]=!0x1,this[_0x550b85(0x18e)](_0x45d49b),this['_attemptToReconnectShortly'](),_0x1b6bd1(new Error(_0x550b85(0x104)));},_0x45d49b[_0x17676c(0x185)]=()=>{var _0x35d69b=_0x17676c;this['_inBrowser']||_0x45d49b[_0x35d69b(0xfa)]&&_0x45d49b[_0x35d69b(0xfa)]['unref']&&_0x45d49b[_0x35d69b(0xfa)]['unref'](),_0x91bb92(_0x45d49b);},_0x45d49b[_0x17676c(0x102)]=()=>{var _0x43abcb=_0x17676c;this[_0x43abcb(0x101)]=!0x0,this[_0x43abcb(0x18e)](_0x45d49b),this[_0x43abcb(0xff)]();},_0x45d49b[_0x17676c(0xb3)]=_0x109891=>{var _0x5a283=_0x17676c;try{if(!(_0x109891!=null&&_0x109891[_0x5a283(0x19e)])||!this[_0x5a283(0x191)])return;let _0x4354b3=JSON[_0x5a283(0x11b)](_0x109891[_0x5a283(0x19e)]);this['eventReceivedCallback'](_0x4354b3[_0x5a283(0xf0)],_0x4354b3[_0x5a283(0x113)],this[_0x5a283(0x198)],this[_0x5a283(0xfd)]);}catch{}};})[_0x37f025(0xd5)](_0x4fe549=>(this[_0x37f025(0x169)]=!0x0,this[_0x37f025(0xb1)]=!0x1,this['_allowedToConnectOnSend']=!0x1,this[_0x37f025(0xe8)]=!0x0,this[_0x37f025(0x187)]=0x0,_0x4fe549))['catch'](_0x291a72=>(this[_0x37f025(0x169)]=!0x1,this[_0x37f025(0xb1)]=!0x1,console[_0x37f025(0x10a)](_0x37f025(0x192)+this[_0x37f025(0x183)]),_0x1b6bd1(new Error(_0x37f025(0x176)+(_0x291a72&&_0x291a72[_0x37f025(0x19b)])))));}));},x[_0x206025(0xa3)]['_disposeWebsocket']=function(_0x1ad1a7){var _0x4b0272=_0x206025;this[_0x4b0272(0x169)]=!0x1,this[_0x4b0272(0xb1)]=!0x1;try{_0x1ad1a7[_0x4b0272(0x102)]=null,_0x1ad1a7['onerror']=null,_0x1ad1a7[_0x4b0272(0x185)]=null;}catch{}try{_0x1ad1a7[_0x4b0272(0xc0)]<0x2&&_0x1ad1a7[_0x4b0272(0x10d)]();}catch{}},x[_0x206025(0xa3)][_0x206025(0xff)]=function(){var _0x593914=_0x206025;clearTimeout(this[_0x593914(0xcf)]),!(this[_0x593914(0x187)]>=this[_0x593914(0x150)])&&(this[_0x593914(0xcf)]=setTimeout(()=>{var _0x2a01db=_0x593914,_0x2a8521;this[_0x2a01db(0x169)]||this[_0x2a01db(0xb1)]||(this[_0x2a01db(0x16a)](),(_0x2a8521=this[_0x2a01db(0x145)])==null||_0x2a8521['catch'](()=>this[_0x2a01db(0xff)]()));},0x1f4),this[_0x593914(0xcf)][_0x593914(0xf5)]&&this[_0x593914(0xcf)]['unref']());},x['prototype'][_0x206025(0xa9)]=async function(_0x3820cf){var _0x10b1d4=_0x206025;try{if(!this['_allowedToSend'])return;this[_0x10b1d4(0x101)]&&this[_0x10b1d4(0x16a)](),(await this[_0x10b1d4(0x145)])[_0x10b1d4(0xa9)](JSON['stringify'](_0x3820cf));}catch(_0x534152){this[_0x10b1d4(0xc2)]?console['warn'](this[_0x10b1d4(0x149)]+':\\x20'+(_0x534152&&_0x534152[_0x10b1d4(0x19b)])):(this['_extendedWarning']=!0x0,console[_0x10b1d4(0x10a)](this[_0x10b1d4(0x149)]+':\\x20'+(_0x534152&&_0x534152[_0x10b1d4(0x19b)]),_0x3820cf)),this[_0x10b1d4(0xe8)]=!0x1,this[_0x10b1d4(0xff)]();}};function _0x1f2e(){var _0x313632=['performance','_allowedToConnectOnSend','onclose','path','logger\\x20websocket\\x20error','serialize','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','https://tinyurl.com/37x8b79t','number','nodeModules','warn','string','substr','close','toUpperCase','time','expId','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','args','react-native','_processTreeNodeResult','undefined','next.js','error','_cleanNode','type','parse','_type','ExpoDevice','[object\\x20Set]','Boolean','cappedElements','_hasSetOnItsPath','reduceOnAccumulatedProcessingTimeMs','forEach','trace','noFunctions','join','_isMap','process','592olDfiE','_dateToString','elapsed','autoExpandPropertyCount','unshift',{\"resolveGetters\":false,\"defaultLimits\":{\"props\":100,\"elements\":100,\"strLength\":51200,\"totalStrLength\":51200,\"autoExpandLimit\":5000,\"autoExpandMaxDepth\":10},\"reducedLimits\":{\"props\":5,\"elements\":5,\"strLength\":256,\"totalStrLength\":768,\"autoExpandLimit\":30,\"autoExpandMaxDepth\":2},\"reducePolicy\":{\"perLogpoint\":{\"reduceOnCount\":50,\"reduceOnAccumulatedProcessingTimeMs\":100,\"resetWhenQuietMs\":500,\"resetOnProcessingTimeAverageMs\":100},\"global\":{\"reduceOnCount\":1000,\"reduceOnAccumulatedProcessingTimeMs\":300,\"resetWhenQuietMs\":50,\"resetOnProcessingTimeAverageMs\":100}}},'name','strLength','reducedLimits','_capIfString','concat','symbol','1.0.0','_sortProps','value','null','hrtime','12FVWkFh','root_exp','versions','test','indexOf','resolveGetters','Map','capped','funcName','bind','current','_ws','isArray','_hasSymbolPropertyOnItsPath','_objectToString','_sendErrorMessage','_console_ninja_session','onerror','_additionalMetadata','_addProperty','_console_ninja','disabledTrace','_maxConnectAttemptCount','[object\\x20Array]','sortProps','_addFunctionsNode','perLogpoint','perf_hooks','1','gateway.docker.internal','charAt','_treeNodePropertiesAfterFullValue','NEXT_RUNTIME','console','getter','Number','_treeNodePropertiesBeforeFullValue','_isUndefined','_isSet','getOwnPropertySymbols','4753408RZbvXH','59806','push','getWebSocketClass',\"c:\\\\Users\\\\ashis\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-1.0.486\\\\node_modules\",'host','_property','_connected','_connectToHostNow','constructor','18998lyWGlj','props','import(\\x27path\\x27)','some','_setNodeLabel','_consoleNinjaAllowedToStart','_getOwnPropertyDescriptor','Error','_hasMapOnItsPath','getOwnPropertyDescriptor','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','1760685820936','pop','RegExp','remix','_blacklistedProperty','_setNodeQueryPath','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','String','location','hits','allStrLength','call','_webSocketErrorDocsLink','map','onopen','valueOf','_connectAttemptCount','rootExpression','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','_addLoadNode','reload','NEGATIVE_INFINITY','_p_name','_disposeWebsocket','_inNextEdge','8600buKRbE','eventReceivedCallback','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_propertyName','parent','2187QYJEaz','_ninjaIgnoreNextError','length','global','_isNegativeZero','_setNodePermissions','message','get','342858SJZiHE','data','toString','_getOwnPropertyNames','startsWith','log','dockerizedApp','_HTMLAllCollection','isExpressionToEvaluate','[object\\x20Date]','autoExpandMaxDepth','prototype','import(\\x27url\\x27)','env','autoExpandPreviousObjects','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','10.0.2.2','send','resetOnProcessingTimeAverageMs','positiveInfinity','Buffer','coverage','defaultLimits','expo','function','_connecting','sort','onmessage','getOwnPropertyNames','angular','index','reducePolicy','array','osName','modules','url','expressionsToEvaluate','nan','_WebSocketClass','_isPrimitiveType','readyState','_getOwnPropertySymbols','_extendedWarning','stackTraceLimit','_WebSocket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','reduceOnCount','_undefined','slice','unknown','origin','object','level','autoExpand','toLowerCase','_reconnectTimeout','elements','now','_Symbol','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','node','then','112855oFBgVg','WebSocket','231076kiFdNR','totalStrLength','Set','date','port','stack','_setNodeId','includes','_setNodeExpandableState','_regExpToString','_setNodeExpressionPath','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','\\x20browser','boolean','autoExpandLimit','set','_allowedToSend','\\x20server','resetWhenQuietMs','depth','timeStamp','count','replace','10ATihzK','method','hostname','reduceLimits','bigint','match','unref','edge','_isPrimitiveWrapperType','_p_','262998SwrgeB','_socket','ws://','_addObjectProperty','_inBrowser','','_attemptToReconnectShortly'];_0x1f2e=function(){return _0x313632;};return _0x1f2e();}function q(_0x5d1bb0,_0x28051d,_0x5316ed,_0x4dc284,_0x2d47b5,_0x24dc52,_0x5c6ac8,_0x143565=G){var _0x382aee=_0x206025;let _0x10cb2d=_0x5316ed['split'](',')[_0x382aee(0x184)](_0x2799b6=>{var _0x19b263=_0x382aee,_0x5ee145,_0x47f567,_0x2e6e4c,_0xe615d4,_0x25b863,_0xc18eaa,_0x4513b4;try{if(!_0x5d1bb0['_console_ninja_session']){let _0x4beab0=((_0x47f567=(_0x5ee145=_0x5d1bb0[_0x19b263(0x128)])==null?void 0x0:_0x5ee145['versions'])==null?void 0x0:_0x47f567[_0x19b263(0xd4)])||((_0xe615d4=(_0x2e6e4c=_0x5d1bb0[_0x19b263(0x128)])==null?void 0x0:_0x2e6e4c[_0x19b263(0xa5)])==null?void 0x0:_0xe615d4['NEXT_RUNTIME'])===_0x19b263(0xf6);(_0x2d47b5===_0x19b263(0x117)||_0x2d47b5===_0x19b263(0x17a)||_0x2d47b5==='astro'||_0x2d47b5===_0x19b263(0xb5))&&(_0x2d47b5+=_0x4beab0?_0x19b263(0xe9):_0x19b263(0xe4));let _0x5742fa='';_0x2d47b5===_0x19b263(0x114)&&(_0x5742fa=(((_0x4513b4=(_0xc18eaa=(_0x25b863=_0x5d1bb0['expo'])==null?void 0x0:_0x25b863[_0x19b263(0xba)])==null?void 0x0:_0xc18eaa[_0x19b263(0x11d)])==null?void 0x0:_0x4513b4[_0x19b263(0xb9)])||'')[_0x19b263(0xce)](),_0x5742fa&&(_0x2d47b5+='\\x20'+_0x5742fa,_0x5742fa==='android'&&(_0x28051d=_0x19b263(0xa8)))),_0x5d1bb0[_0x19b263(0x14a)]={'id':+new Date(),'tool':_0x2d47b5},_0x5c6ac8&&_0x2d47b5&&!_0x4beab0&&(_0x5742fa?console['log'](_0x19b263(0x112)+_0x5742fa+',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'):console[_0x19b263(0x1a2)](_0x19b263(0xe3)+(_0x2d47b5[_0x19b263(0x158)](0x0)[_0x19b263(0x10e)]()+_0x2d47b5[_0x19b263(0x10c)](0x1))+',',_0x19b263(0x17d),_0x19b263(0xa7)));}let _0x28eafc=new x(_0x5d1bb0,_0x28051d,_0x2799b6,_0x4dc284,_0x24dc52,_0x143565);return _0x28eafc[_0x19b263(0xa9)][_0x19b263(0x143)](_0x28eafc);}catch(_0x1ac335){return console[_0x19b263(0x10a)](_0x19b263(0x106),_0x1ac335&&_0x1ac335[_0x19b263(0x19b)]),()=>{};}});return _0x3f4d85=>_0x10cb2d[_0x382aee(0x123)](_0x3f3397=>_0x3f3397(_0x3f4d85));}function _0x8070(_0x533792,_0x4dd89c){var _0x1f2e40=_0x1f2e();return _0x8070=function(_0x807058,_0x54b481){_0x807058=_0x807058-0xa2;var _0x4f57b5=_0x1f2e40[_0x807058];return _0x4f57b5;},_0x8070(_0x533792,_0x4dd89c);}function G(_0x379fb8,_0x313ee3,_0x2fd7c5,_0x3c5a4e){var _0x528bff=_0x206025;_0x3c5a4e&&_0x379fb8===_0x528bff(0x18b)&&_0x2fd7c5['location'][_0x528bff(0x18b)]();}function B(_0x42e71c){var _0x3c48d1=_0x206025,_0x30cebb,_0x49d075;let _0x15e433=function(_0x4e0a64,_0x2a81f4){return _0x2a81f4-_0x4e0a64;},_0x15cf12;if(_0x42e71c[_0x3c48d1(0x100)])_0x15cf12=function(){var _0x25ce7e=_0x3c48d1;return _0x42e71c[_0x25ce7e(0x100)][_0x25ce7e(0xd1)]();};else{if(_0x42e71c[_0x3c48d1(0x128)]&&_0x42e71c['process'][_0x3c48d1(0x139)]&&((_0x49d075=(_0x30cebb=_0x42e71c[_0x3c48d1(0x128)])==null?void 0x0:_0x30cebb['env'])==null?void 0x0:_0x49d075[_0x3c48d1(0x15a)])!==_0x3c48d1(0xf6))_0x15cf12=function(){var _0x2b1db0=_0x3c48d1;return _0x42e71c[_0x2b1db0(0x128)][_0x2b1db0(0x139)]();},_0x15e433=function(_0x27a10c,_0x52b991){return 0x3e8*(_0x52b991[0x0]-_0x27a10c[0x0])+(_0x52b991[0x1]-_0x27a10c[0x1])/0xf4240;};else try{let {performance:_0x4e8aca}=require(_0x3c48d1(0x155));_0x15cf12=function(){var _0x442526=_0x3c48d1;return _0x4e8aca[_0x442526(0xd1)]();};}catch{_0x15cf12=function(){return+new Date();};}}return{'elapsed':_0x15e433,'timeStamp':_0x15cf12,'now':()=>Date[_0x3c48d1(0xd1)]()};}function H(_0x129b12,_0x5d5f92,_0x1c293c){var _0x31f57e=_0x206025,_0x5dfd92,_0x3c35b8,_0x527c3c,_0x1cf2a9,_0xc2a39f,_0x19ebba,_0x49f22a,_0x2d0f72,_0x4b2de8;if(_0x129b12[_0x31f57e(0x171)]!==void 0x0)return _0x129b12['_consoleNinjaAllowedToStart'];let _0x29fa56=((_0x3c35b8=(_0x5dfd92=_0x129b12[_0x31f57e(0x128)])==null?void 0x0:_0x5dfd92['versions'])==null?void 0x0:_0x3c35b8[_0x31f57e(0xd4)])||((_0x1cf2a9=(_0x527c3c=_0x129b12[_0x31f57e(0x128)])==null?void 0x0:_0x527c3c['env'])==null?void 0x0:_0x1cf2a9[_0x31f57e(0x15a)])===_0x31f57e(0xf6),_0x539791=!!(_0x1c293c===_0x31f57e(0x114)&&((_0x49f22a=(_0x19ebba=(_0xc2a39f=_0x129b12[_0x31f57e(0xaf)])==null?void 0x0:_0xc2a39f[_0x31f57e(0xba)])==null?void 0x0:_0x19ebba[_0x31f57e(0x11d)])==null?void 0x0:_0x49f22a[_0x31f57e(0xb9)]));function _0x452777(_0x2b4164){var _0xeb13fb=_0x31f57e;if(_0x2b4164[_0xeb13fb(0x1a1)]('/')&&_0x2b4164['endsWith']('/')){let _0x328aa6=new RegExp(_0x2b4164['slice'](0x1,-0x1));return _0xf9beb3=>_0x328aa6[_0xeb13fb(0x13d)](_0xf9beb3);}else{if(_0x2b4164['includes']('*')||_0x2b4164[_0xeb13fb(0xdf)]('?')){let _0x170f8e=new RegExp('^'+_0x2b4164[_0xeb13fb(0xee)](/\\./g,String['fromCharCode'](0x5c)+'.')['replace'](/\\*/g,'.*')[_0xeb13fb(0xee)](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x1b550f=>_0x170f8e[_0xeb13fb(0x13d)](_0x1b550f);}else return _0x481cbf=>_0x481cbf===_0x2b4164;}}let _0x2541c5=_0x5d5f92['map'](_0x452777);return _0x129b12[_0x31f57e(0x171)]=_0x29fa56||!_0x5d5f92,!_0x129b12[_0x31f57e(0x171)]&&((_0x2d0f72=_0x129b12[_0x31f57e(0x17f)])==null?void 0x0:_0x2d0f72['hostname'])&&(_0x129b12['_consoleNinjaAllowedToStart']=_0x2541c5[_0x31f57e(0x16f)](_0x5aac20=>_0x5aac20(_0x129b12[_0x31f57e(0x17f)]['hostname']))),_0x539791&&!_0x129b12[_0x31f57e(0x171)]&&!((_0x4b2de8=_0x129b12[_0x31f57e(0x17f)])!=null&&_0x4b2de8[_0x31f57e(0xf1)])&&(_0x129b12[_0x31f57e(0x171)]=!0x0),_0x129b12[_0x31f57e(0x171)];}function X(_0x29fdc9,_0x2e6e58,_0x47d813,_0x2fc14c,_0x16053c){var _0x5d4413=_0x206025;_0x29fdc9=_0x29fdc9,_0x2e6e58=_0x2e6e58,_0x47d813=_0x47d813,_0x2fc14c=_0x2fc14c,_0x16053c=_0x16053c,_0x16053c=_0x16053c||{},_0x16053c['defaultLimits']=_0x16053c[_0x5d4413(0xae)]||{},_0x16053c[_0x5d4413(0x131)]=_0x16053c[_0x5d4413(0x131)]||{},_0x16053c['reducePolicy']=_0x16053c[_0x5d4413(0xb7)]||{},_0x16053c[_0x5d4413(0xb7)]['perLogpoint']=_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)]||{},_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x198)]=_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x198)]||{};let _0xee9e24={'perLogpoint':{'reduceOnCount':_0x16053c['reducePolicy'][_0x5d4413(0x154)]['reduceOnCount']||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)][_0x5d4413(0x122)]||0x64,'resetWhenQuietMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)]['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)][_0x5d4413(0xaa)]||0x64},'global':{'reduceOnCount':_0x16053c[_0x5d4413(0xb7)]['global'][_0x5d4413(0xc6)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x16053c['reducePolicy']['global'][_0x5d4413(0x122)]||0x12c,'resetWhenQuietMs':_0x16053c[_0x5d4413(0xb7)]['global']['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x198)]['resetOnProcessingTimeAverageMs']||0x64}},_0x1f62aa=B(_0x29fdc9),_0x57e37c=_0x1f62aa['elapsed'],_0x1c7b58=_0x1f62aa[_0x5d4413(0xec)];function _0x4ec6f8(){var _0x1abe1a=_0x5d4413;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x29fdc9[_0x1abe1a(0x116)],this[_0x1abe1a(0x1a4)]=_0x29fdc9['HTMLAllCollection'],this[_0x1abe1a(0x172)]=Object[_0x1abe1a(0x175)],this[_0x1abe1a(0x1a0)]=Object[_0x1abe1a(0xb4)],this[_0x1abe1a(0xd2)]=_0x29fdc9['Symbol'],this[_0x1abe1a(0xe1)]=RegExp['prototype'][_0x1abe1a(0x19f)],this[_0x1abe1a(0x12a)]=Date[_0x1abe1a(0xa3)][_0x1abe1a(0x19f)];}_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x105)]=function(_0xecd79f,_0x130258,_0x3d83a4,_0x4b701c){var _0x532f2b=_0x5d4413,_0xe7aebd=this,_0x5c720a=_0x3d83a4[_0x532f2b(0xcd)];function _0x52bf8f(_0x27c3f1,_0x1d1770,_0x595195){var _0x56e290=_0x532f2b;_0x1d1770['type']=_0x56e290(0xc9),_0x1d1770[_0x56e290(0x118)]=_0x27c3f1[_0x56e290(0x19b)],_0x41a216=_0x595195[_0x56e290(0xd4)][_0x56e290(0x144)],_0x595195[_0x56e290(0xd4)][_0x56e290(0x144)]=_0x1d1770,_0xe7aebd['_treeNodePropertiesBeforeFullValue'](_0x1d1770,_0x595195);}let _0x4be16e;_0x29fdc9['console']&&(_0x4be16e=_0x29fdc9['console'][_0x532f2b(0x118)],_0x4be16e&&(_0x29fdc9[_0x532f2b(0x15b)]['error']=function(){}));try{try{_0x3d83a4[_0x532f2b(0xcc)]++,_0x3d83a4[_0x532f2b(0xcd)]&&_0x3d83a4['autoExpandPreviousObjects']['push'](_0x130258);var _0x1cac69,_0x2cf7f3,_0x25dcc0,_0x5129d9,_0x303749=[],_0x1db1f6=[],_0x278e4a,_0x26661d=this[_0x532f2b(0x11c)](_0x130258),_0x4a0157=_0x26661d==='array',_0x4d32e9=!0x1,_0x77d70a=_0x26661d===_0x532f2b(0xb0),_0x10033c=this['_isPrimitiveType'](_0x26661d),_0x39cf1e=this['_isPrimitiveWrapperType'](_0x26661d),_0x17e1fc=_0x10033c||_0x39cf1e,_0x3f6c4c={},_0x4d271f=0x0,_0x5bec67=!0x1,_0x41a216,_0x45509d=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x3d83a4[_0x532f2b(0xeb)]){if(_0x4a0157){if(_0x2cf7f3=_0x130258['length'],_0x2cf7f3>_0x3d83a4[_0x532f2b(0xd0)]){for(_0x25dcc0=0x0,_0x5129d9=_0x3d83a4['elements'],_0x1cac69=_0x25dcc0;_0x1cac69<_0x5129d9;_0x1cac69++)_0x1db1f6['push'](_0xe7aebd[_0x532f2b(0x14d)](_0x303749,_0x130258,_0x26661d,_0x1cac69,_0x3d83a4));_0xecd79f[_0x532f2b(0x120)]=!0x0;}else{for(_0x25dcc0=0x0,_0x5129d9=_0x2cf7f3,_0x1cac69=_0x25dcc0;_0x1cac69<_0x5129d9;_0x1cac69++)_0x1db1f6[_0x532f2b(0x164)](_0xe7aebd[_0x532f2b(0x14d)](_0x303749,_0x130258,_0x26661d,_0x1cac69,_0x3d83a4));}_0x3d83a4[_0x532f2b(0x12c)]+=_0x1db1f6[_0x532f2b(0x197)];}if(!(_0x26661d===_0x532f2b(0x138)||_0x26661d===_0x532f2b(0x116))&&!_0x10033c&&_0x26661d!==_0x532f2b(0x17e)&&_0x26661d!==_0x532f2b(0xac)&&_0x26661d!==_0x532f2b(0xf3)){var _0x3d7234=_0x4b701c[_0x532f2b(0x16d)]||_0x3d83a4['props'];if(this['_isSet'](_0x130258)?(_0x1cac69=0x0,_0x130258[_0x532f2b(0x123)](function(_0x1c2da5){var _0x4aa18a=_0x532f2b;if(_0x4d271f++,_0x3d83a4['autoExpandPropertyCount']++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;return;}if(!_0x3d83a4[_0x4aa18a(0x1a5)]&&_0x3d83a4[_0x4aa18a(0xcd)]&&_0x3d83a4[_0x4aa18a(0x12c)]>_0x3d83a4[_0x4aa18a(0xe6)]){_0x5bec67=!0x0;return;}_0x1db1f6[_0x4aa18a(0x164)](_0xe7aebd['_addProperty'](_0x303749,_0x130258,_0x4aa18a(0xda),_0x1cac69++,_0x3d83a4,function(_0x4e8b2c){return function(){return _0x4e8b2c;};}(_0x1c2da5)));})):this[_0x532f2b(0x127)](_0x130258)&&_0x130258[_0x532f2b(0x123)](function(_0x1b6187,_0x1dc248){var _0x451ef9=_0x532f2b;if(_0x4d271f++,_0x3d83a4[_0x451ef9(0x12c)]++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;return;}if(!_0x3d83a4[_0x451ef9(0x1a5)]&&_0x3d83a4[_0x451ef9(0xcd)]&&_0x3d83a4[_0x451ef9(0x12c)]>_0x3d83a4[_0x451ef9(0xe6)]){_0x5bec67=!0x0;return;}var _0x3ecd95=_0x1dc248[_0x451ef9(0x19f)]();_0x3ecd95[_0x451ef9(0x197)]>0x64&&(_0x3ecd95=_0x3ecd95[_0x451ef9(0xc8)](0x0,0x64)+'...'),_0x1db1f6['push'](_0xe7aebd[_0x451ef9(0x14d)](_0x303749,_0x130258,_0x451ef9(0x140),_0x3ecd95,_0x3d83a4,function(_0xc22705){return function(){return _0xc22705;};}(_0x1b6187)));}),!_0x4d32e9){try{for(_0x278e4a in _0x130258)if(!(_0x4a0157&&_0x45509d[_0x532f2b(0x13d)](_0x278e4a))&&!this[_0x532f2b(0x17b)](_0x130258,_0x278e4a,_0x3d83a4)){if(_0x4d271f++,_0x3d83a4['autoExpandPropertyCount']++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;break;}if(!_0x3d83a4[_0x532f2b(0x1a5)]&&_0x3d83a4['autoExpand']&&_0x3d83a4[_0x532f2b(0x12c)]>_0x3d83a4[_0x532f2b(0xe6)]){_0x5bec67=!0x0;break;}_0x1db1f6[_0x532f2b(0x164)](_0xe7aebd[_0x532f2b(0xfc)](_0x303749,_0x3f6c4c,_0x130258,_0x26661d,_0x278e4a,_0x3d83a4));}}catch{}if(_0x3f6c4c['_p_length']=!0x0,_0x77d70a&&(_0x3f6c4c[_0x532f2b(0x18d)]=!0x0),!_0x5bec67){var _0x169628=[][_0x532f2b(0x133)](this['_getOwnPropertyNames'](_0x130258))[_0x532f2b(0x133)](this[_0x532f2b(0xc1)](_0x130258));for(_0x1cac69=0x0,_0x2cf7f3=_0x169628['length'];_0x1cac69<_0x2cf7f3;_0x1cac69++)if(_0x278e4a=_0x169628[_0x1cac69],!(_0x4a0157&&_0x45509d[_0x532f2b(0x13d)](_0x278e4a[_0x532f2b(0x19f)]()))&&!this[_0x532f2b(0x17b)](_0x130258,_0x278e4a,_0x3d83a4)&&!_0x3f6c4c[typeof _0x278e4a!=_0x532f2b(0x134)?_0x532f2b(0xf8)+_0x278e4a[_0x532f2b(0x19f)]():_0x278e4a]){if(_0x4d271f++,_0x3d83a4[_0x532f2b(0x12c)]++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;break;}if(!_0x3d83a4[_0x532f2b(0x1a5)]&&_0x3d83a4['autoExpand']&&_0x3d83a4[_0x532f2b(0x12c)]>_0x3d83a4[_0x532f2b(0xe6)]){_0x5bec67=!0x0;break;}_0x1db1f6['push'](_0xe7aebd[_0x532f2b(0xfc)](_0x303749,_0x3f6c4c,_0x130258,_0x26661d,_0x278e4a,_0x3d83a4));}}}}}if(_0xecd79f[_0x532f2b(0x11a)]=_0x26661d,_0x17e1fc?(_0xecd79f['value']=_0x130258['valueOf'](),this[_0x532f2b(0x132)](_0x26661d,_0xecd79f,_0x3d83a4,_0x4b701c)):_0x26661d===_0x532f2b(0xdb)?_0xecd79f[_0x532f2b(0x137)]=this[_0x532f2b(0x12a)]['call'](_0x130258):_0x26661d===_0x532f2b(0xf3)?_0xecd79f[_0x532f2b(0x137)]=_0x130258['toString']():_0x26661d===_0x532f2b(0x179)?_0xecd79f[_0x532f2b(0x137)]=this[_0x532f2b(0xe1)][_0x532f2b(0x182)](_0x130258):_0x26661d===_0x532f2b(0x134)&&this[_0x532f2b(0xd2)]?_0xecd79f['value']=this[_0x532f2b(0xd2)][_0x532f2b(0xa3)]['toString'][_0x532f2b(0x182)](_0x130258):!_0x3d83a4[_0x532f2b(0xeb)]&&!(_0x26661d==='null'||_0x26661d===_0x532f2b(0x116))&&(delete _0xecd79f[_0x532f2b(0x137)],_0xecd79f[_0x532f2b(0x141)]=!0x0),_0x5bec67&&(_0xecd79f['cappedProps']=!0x0),_0x41a216=_0x3d83a4[_0x532f2b(0xd4)][_0x532f2b(0x144)],_0x3d83a4[_0x532f2b(0xd4)][_0x532f2b(0x144)]=_0xecd79f,this[_0x532f2b(0x15e)](_0xecd79f,_0x3d83a4),_0x1db1f6[_0x532f2b(0x197)]){for(_0x1cac69=0x0,_0x2cf7f3=_0x1db1f6[_0x532f2b(0x197)];_0x1cac69<_0x2cf7f3;_0x1cac69++)_0x1db1f6[_0x1cac69](_0x1cac69);}_0x303749['length']&&(_0xecd79f['props']=_0x303749);}catch(_0x5140f8){_0x52bf8f(_0x5140f8,_0xecd79f,_0x3d83a4);}this[_0x532f2b(0x14c)](_0x130258,_0xecd79f),this[_0x532f2b(0x159)](_0xecd79f,_0x3d83a4),_0x3d83a4['node']['current']=_0x41a216,_0x3d83a4[_0x532f2b(0xcc)]--,_0x3d83a4[_0x532f2b(0xcd)]=_0x5c720a,_0x3d83a4['autoExpand']&&_0x3d83a4[_0x532f2b(0xa6)][_0x532f2b(0x178)]();}finally{_0x4be16e&&(_0x29fdc9[_0x532f2b(0x15b)][_0x532f2b(0x118)]=_0x4be16e);}return _0xecd79f;},_0x4ec6f8['prototype'][_0x5d4413(0xc1)]=function(_0x266f17){var _0xf3683a=_0x5d4413;return Object[_0xf3683a(0x161)]?Object[_0xf3683a(0x161)](_0x266f17):[];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x160)]=function(_0x40ce39){var _0x323849=_0x5d4413;return!!(_0x40ce39&&_0x29fdc9['Set']&&this[_0x323849(0x148)](_0x40ce39)===_0x323849(0x11e)&&_0x40ce39[_0x323849(0x123)]);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x17b)]=function(_0x2aef7d,_0x107af1,_0x383bfa){var _0x2f2b6a=_0x5d4413;if(!_0x383bfa[_0x2f2b6a(0x13f)]){let _0x5d22d6=this[_0x2f2b6a(0x172)](_0x2aef7d,_0x107af1);if(_0x5d22d6&&_0x5d22d6[_0x2f2b6a(0x19c)])return!0x0;}return _0x383bfa[_0x2f2b6a(0x125)]?typeof _0x2aef7d[_0x107af1]==_0x2f2b6a(0xb0):!0x1;},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x11c)]=function(_0x4d4b8a){var _0x3d2593=_0x5d4413,_0x53e732='';return _0x53e732=typeof _0x4d4b8a,_0x53e732===_0x3d2593(0xcb)?this['_objectToString'](_0x4d4b8a)===_0x3d2593(0x151)?_0x53e732=_0x3d2593(0xb8):this[_0x3d2593(0x148)](_0x4d4b8a)===_0x3d2593(0x1a6)?_0x53e732='date':this['_objectToString'](_0x4d4b8a)==='[object\\x20BigInt]'?_0x53e732=_0x3d2593(0xf3):_0x4d4b8a===null?_0x53e732=_0x3d2593(0x138):_0x4d4b8a[_0x3d2593(0x16b)]&&(_0x53e732=_0x4d4b8a[_0x3d2593(0x16b)][_0x3d2593(0x12f)]||_0x53e732):_0x53e732===_0x3d2593(0x116)&&this[_0x3d2593(0x1a4)]&&_0x4d4b8a instanceof this[_0x3d2593(0x1a4)]&&(_0x53e732='HTMLAllCollection'),_0x53e732;},_0x4ec6f8[_0x5d4413(0xa3)]['_objectToString']=function(_0x168387){var _0x37f17=_0x5d4413;return Object[_0x37f17(0xa3)]['toString'][_0x37f17(0x182)](_0x168387);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xbf)]=function(_0x38f1bf){var _0x1e0a9a=_0x5d4413;return _0x38f1bf===_0x1e0a9a(0xe5)||_0x38f1bf===_0x1e0a9a(0x10b)||_0x38f1bf===_0x1e0a9a(0x108);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xf7)]=function(_0x126cf5){var _0x14f7d4=_0x5d4413;return _0x126cf5===_0x14f7d4(0x11f)||_0x126cf5===_0x14f7d4(0x17e)||_0x126cf5===_0x14f7d4(0x15d);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x14d)]=function(_0x465760,_0x4221c9,_0x3874da,_0x2f1c46,_0x35ecf4,_0x591db7){var _0x421ec7=this;return function(_0x50d048){var _0x3e5502=_0x8070,_0x58645b=_0x35ecf4['node'][_0x3e5502(0x144)],_0x461b7d=_0x35ecf4[_0x3e5502(0xd4)]['index'],_0x51476b=_0x35ecf4[_0x3e5502(0xd4)]['parent'];_0x35ecf4[_0x3e5502(0xd4)][_0x3e5502(0x194)]=_0x58645b,_0x35ecf4['node'][_0x3e5502(0xb6)]=typeof _0x2f1c46==_0x3e5502(0x108)?_0x2f1c46:_0x50d048,_0x465760[_0x3e5502(0x164)](_0x421ec7[_0x3e5502(0x168)](_0x4221c9,_0x3874da,_0x2f1c46,_0x35ecf4,_0x591db7)),_0x35ecf4[_0x3e5502(0xd4)][_0x3e5502(0x194)]=_0x51476b,_0x35ecf4[_0x3e5502(0xd4)][_0x3e5502(0xb6)]=_0x461b7d;};},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xfc)]=function(_0x4f95ed,_0x5bce7f,_0x26b6b8,_0x115000,_0x2f5960,_0x504da4,_0x5c7f35){var _0x798496=_0x5d4413,_0x589084=this;return _0x5bce7f[typeof _0x2f5960!=_0x798496(0x134)?_0x798496(0xf8)+_0x2f5960[_0x798496(0x19f)]():_0x2f5960]=!0x0,function(_0xb441cf){var _0x5196c4=_0x798496,_0x353e9c=_0x504da4['node']['current'],_0x55658b=_0x504da4[_0x5196c4(0xd4)]['index'],_0x55fa35=_0x504da4[_0x5196c4(0xd4)][_0x5196c4(0x194)];_0x504da4[_0x5196c4(0xd4)]['parent']=_0x353e9c,_0x504da4[_0x5196c4(0xd4)][_0x5196c4(0xb6)]=_0xb441cf,_0x4f95ed[_0x5196c4(0x164)](_0x589084[_0x5196c4(0x168)](_0x26b6b8,_0x115000,_0x2f5960,_0x504da4,_0x5c7f35)),_0x504da4[_0x5196c4(0xd4)]['parent']=_0x55fa35,_0x504da4[_0x5196c4(0xd4)][_0x5196c4(0xb6)]=_0x55658b;};},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x168)]=function(_0x306210,_0x2180f0,_0x5ca781,_0x408a5a,_0x48e11c){var _0xc84a2c=_0x5d4413,_0x5c20d0=this;_0x48e11c||(_0x48e11c=function(_0x31ed11,_0x513401){return _0x31ed11[_0x513401];});var _0x4c683d=_0x5ca781['toString'](),_0x24025e=_0x408a5a[_0xc84a2c(0xbc)]||{},_0x37d022=_0x408a5a['depth'],_0x54791e=_0x408a5a['isExpressionToEvaluate'];try{var _0x15fed0=this['_isMap'](_0x306210),_0x4f96ee=_0x4c683d;_0x15fed0&&_0x4f96ee[0x0]==='\\x27'&&(_0x4f96ee=_0x4f96ee[_0xc84a2c(0x10c)](0x1,_0x4f96ee[_0xc84a2c(0x197)]-0x2));var _0x169a7a=_0x408a5a[_0xc84a2c(0xbc)]=_0x24025e[_0xc84a2c(0xf8)+_0x4f96ee];_0x169a7a&&(_0x408a5a[_0xc84a2c(0xeb)]=_0x408a5a[_0xc84a2c(0xeb)]+0x1),_0x408a5a[_0xc84a2c(0x1a5)]=!!_0x169a7a;var _0x4a6bef=typeof _0x5ca781==_0xc84a2c(0x134),_0x3e82c0={'name':_0x4a6bef||_0x15fed0?_0x4c683d:this[_0xc84a2c(0x193)](_0x4c683d)};if(_0x4a6bef&&(_0x3e82c0[_0xc84a2c(0x134)]=!0x0),!(_0x2180f0==='array'||_0x2180f0===_0xc84a2c(0x173))){var _0x2d07cc=this['_getOwnPropertyDescriptor'](_0x306210,_0x5ca781);if(_0x2d07cc&&(_0x2d07cc[_0xc84a2c(0xe7)]&&(_0x3e82c0['setter']=!0x0),_0x2d07cc[_0xc84a2c(0x19c)]&&!_0x169a7a&&!_0x408a5a[_0xc84a2c(0x13f)]))return _0x3e82c0[_0xc84a2c(0x15c)]=!0x0,this['_processTreeNodeResult'](_0x3e82c0,_0x408a5a),_0x3e82c0;}var _0x38d3a5;try{_0x38d3a5=_0x48e11c(_0x306210,_0x5ca781);}catch(_0x3f76c2){return _0x3e82c0={'name':_0x4c683d,'type':'unknown','error':_0x3f76c2[_0xc84a2c(0x19b)]},this[_0xc84a2c(0x115)](_0x3e82c0,_0x408a5a),_0x3e82c0;}var _0x6a840a=this[_0xc84a2c(0x11c)](_0x38d3a5),_0x4492eb=this[_0xc84a2c(0xbf)](_0x6a840a);if(_0x3e82c0[_0xc84a2c(0x11a)]=_0x6a840a,_0x4492eb)this[_0xc84a2c(0x115)](_0x3e82c0,_0x408a5a,_0x38d3a5,function(){var _0x7e70f7=_0xc84a2c;_0x3e82c0[_0x7e70f7(0x137)]=_0x38d3a5[_0x7e70f7(0x186)](),!_0x169a7a&&_0x5c20d0[_0x7e70f7(0x132)](_0x6a840a,_0x3e82c0,_0x408a5a,{});});else{var _0x59a4b9=_0x408a5a[_0xc84a2c(0xcd)]&&_0x408a5a[_0xc84a2c(0xcc)]<_0x408a5a[_0xc84a2c(0xa2)]&&_0x408a5a[_0xc84a2c(0xa6)][_0xc84a2c(0x13e)](_0x38d3a5)<0x0&&_0x6a840a!==_0xc84a2c(0xb0)&&_0x408a5a['autoExpandPropertyCount']<_0x408a5a['autoExpandLimit'];_0x59a4b9||_0x408a5a[_0xc84a2c(0xcc)]<_0x37d022||_0x169a7a?(this['serialize'](_0x3e82c0,_0x38d3a5,_0x408a5a,_0x169a7a||{}),this[_0xc84a2c(0x14c)](_0x38d3a5,_0x3e82c0)):this[_0xc84a2c(0x115)](_0x3e82c0,_0x408a5a,_0x38d3a5,function(){var _0x36bf02=_0xc84a2c;_0x6a840a===_0x36bf02(0x138)||_0x6a840a===_0x36bf02(0x116)||(delete _0x3e82c0[_0x36bf02(0x137)],_0x3e82c0[_0x36bf02(0x141)]=!0x0);});}return _0x3e82c0;}finally{_0x408a5a[_0xc84a2c(0xbc)]=_0x24025e,_0x408a5a[_0xc84a2c(0xeb)]=_0x37d022,_0x408a5a[_0xc84a2c(0x1a5)]=_0x54791e;}},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x132)]=function(_0x5dbb71,_0x160dc5,_0x566044,_0x14045a){var _0xd41be5=_0x5d4413,_0x3d4872=_0x14045a[_0xd41be5(0x130)]||_0x566044[_0xd41be5(0x130)];if((_0x5dbb71===_0xd41be5(0x10b)||_0x5dbb71===_0xd41be5(0x17e))&&_0x160dc5[_0xd41be5(0x137)]){let _0x241f35=_0x160dc5[_0xd41be5(0x137)]['length'];_0x566044[_0xd41be5(0x181)]+=_0x241f35,_0x566044['allStrLength']>_0x566044[_0xd41be5(0xd9)]?(_0x160dc5[_0xd41be5(0x141)]='',delete _0x160dc5[_0xd41be5(0x137)]):_0x241f35>_0x3d4872&&(_0x160dc5[_0xd41be5(0x141)]=_0x160dc5[_0xd41be5(0x137)][_0xd41be5(0x10c)](0x0,_0x3d4872),delete _0x160dc5[_0xd41be5(0x137)]);}},_0x4ec6f8['prototype'][_0x5d4413(0x127)]=function(_0x1c205c){var _0x15a6f3=_0x5d4413;return!!(_0x1c205c&&_0x29fdc9[_0x15a6f3(0x140)]&&this[_0x15a6f3(0x148)](_0x1c205c)==='[object\\x20Map]'&&_0x1c205c[_0x15a6f3(0x123)]);},_0x4ec6f8[_0x5d4413(0xa3)]['_propertyName']=function(_0x555f36){var _0x30eb10=_0x5d4413;if(_0x555f36[_0x30eb10(0xf4)](/^\\d+$/))return _0x555f36;var _0x459c76;try{_0x459c76=JSON['stringify'](''+_0x555f36);}catch{_0x459c76='\\x22'+this['_objectToString'](_0x555f36)+'\\x22';}return _0x459c76[_0x30eb10(0xf4)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x459c76=_0x459c76[_0x30eb10(0x10c)](0x1,_0x459c76[_0x30eb10(0x197)]-0x2):_0x459c76=_0x459c76[_0x30eb10(0xee)](/'/g,'\\x5c\\x27')[_0x30eb10(0xee)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x459c76;},_0x4ec6f8['prototype'][_0x5d4413(0x115)]=function(_0x37a2bc,_0x3d78b9,_0x2b32a2,_0x1a3790){var _0x17ed05=_0x5d4413;this[_0x17ed05(0x15e)](_0x37a2bc,_0x3d78b9),_0x1a3790&&_0x1a3790(),this[_0x17ed05(0x14c)](_0x2b32a2,_0x37a2bc),this['_treeNodePropertiesAfterFullValue'](_0x37a2bc,_0x3d78b9);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x15e)]=function(_0x34cae9,_0x275743){var _0xa3e7c2=_0x5d4413;this[_0xa3e7c2(0xde)](_0x34cae9,_0x275743),this[_0xa3e7c2(0x17c)](_0x34cae9,_0x275743),this[_0xa3e7c2(0xe2)](_0x34cae9,_0x275743),this[_0xa3e7c2(0x19a)](_0x34cae9,_0x275743);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xde)]=function(_0x32f5e5,_0x53a774){},_0x4ec6f8['prototype']['_setNodeQueryPath']=function(_0x41a6cf,_0x546223){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x170)]=function(_0x8faa79,_0x3cb609){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x15f)]=function(_0x470b4d){var _0x1c20a9=_0x5d4413;return _0x470b4d===this[_0x1c20a9(0xc7)];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x159)]=function(_0x5e1348,_0x3e13d3){var _0x210da8=_0x5d4413;this['_setNodeLabel'](_0x5e1348,_0x3e13d3),this['_setNodeExpandableState'](_0x5e1348),_0x3e13d3[_0x210da8(0x152)]&&this['_sortProps'](_0x5e1348),this[_0x210da8(0x153)](_0x5e1348,_0x3e13d3),this[_0x210da8(0x18a)](_0x5e1348,_0x3e13d3),this[_0x210da8(0x119)](_0x5e1348);},_0x4ec6f8[_0x5d4413(0xa3)]['_additionalMetadata']=function(_0x179ebd,_0x4a5428){var _0x29050a=_0x5d4413;try{_0x179ebd&&typeof _0x179ebd[_0x29050a(0x197)]==_0x29050a(0x108)&&(_0x4a5428[_0x29050a(0x197)]=_0x179ebd[_0x29050a(0x197)]);}catch{}if(_0x4a5428[_0x29050a(0x11a)]===_0x29050a(0x108)||_0x4a5428[_0x29050a(0x11a)]==='Number'){if(isNaN(_0x4a5428[_0x29050a(0x137)]))_0x4a5428[_0x29050a(0xbd)]=!0x0,delete _0x4a5428[_0x29050a(0x137)];else switch(_0x4a5428[_0x29050a(0x137)]){case Number['POSITIVE_INFINITY']:_0x4a5428[_0x29050a(0xab)]=!0x0,delete _0x4a5428['value'];break;case Number[_0x29050a(0x18c)]:_0x4a5428['negativeInfinity']=!0x0,delete _0x4a5428[_0x29050a(0x137)];break;case 0x0:this[_0x29050a(0x199)](_0x4a5428['value'])&&(_0x4a5428['negativeZero']=!0x0);break;}}else _0x4a5428['type']==='function'&&typeof _0x179ebd[_0x29050a(0x12f)]==_0x29050a(0x10b)&&_0x179ebd[_0x29050a(0x12f)]&&_0x4a5428['name']&&_0x179ebd[_0x29050a(0x12f)]!==_0x4a5428[_0x29050a(0x12f)]&&(_0x4a5428[_0x29050a(0x142)]=_0x179ebd[_0x29050a(0x12f)]);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x199)]=function(_0xff5555){var _0x2b82a9=_0x5d4413;return 0x1/_0xff5555===Number[_0x2b82a9(0x18c)];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x136)]=function(_0x243e50){var _0x4f6738=_0x5d4413;!_0x243e50['props']||!_0x243e50[_0x4f6738(0x16d)][_0x4f6738(0x197)]||_0x243e50[_0x4f6738(0x11a)]===_0x4f6738(0xb8)||_0x243e50['type']===_0x4f6738(0x140)||_0x243e50['type']===_0x4f6738(0xda)||_0x243e50[_0x4f6738(0x16d)][_0x4f6738(0xb2)](function(_0x49ebe3,_0x5a68f3){var _0x16ebcb=_0x4f6738,_0x58f5dc=_0x49ebe3[_0x16ebcb(0x12f)][_0x16ebcb(0xce)](),_0x3e8bb7=_0x5a68f3[_0x16ebcb(0x12f)]['toLowerCase']();return _0x58f5dc<_0x3e8bb7?-0x1:_0x58f5dc>_0x3e8bb7?0x1:0x0;});},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x153)]=function(_0x9397d1,_0x3506cd){var _0x46fa9c=_0x5d4413;if(!(_0x3506cd[_0x46fa9c(0x125)]||!_0x9397d1['props']||!_0x9397d1[_0x46fa9c(0x16d)][_0x46fa9c(0x197)])){for(var _0x33052e=[],_0x21b61c=[],_0x31e004=0x0,_0x3263d2=_0x9397d1[_0x46fa9c(0x16d)][_0x46fa9c(0x197)];_0x31e004<_0x3263d2;_0x31e004++){var _0x4367c0=_0x9397d1['props'][_0x31e004];_0x4367c0[_0x46fa9c(0x11a)]===_0x46fa9c(0xb0)?_0x33052e['push'](_0x4367c0):_0x21b61c['push'](_0x4367c0);}if(!(!_0x21b61c[_0x46fa9c(0x197)]||_0x33052e[_0x46fa9c(0x197)]<=0x1)){_0x9397d1[_0x46fa9c(0x16d)]=_0x21b61c;var _0x12a238={'functionsNode':!0x0,'props':_0x33052e};this[_0x46fa9c(0xde)](_0x12a238,_0x3506cd),this[_0x46fa9c(0x170)](_0x12a238,_0x3506cd),this[_0x46fa9c(0xe0)](_0x12a238),this[_0x46fa9c(0x19a)](_0x12a238,_0x3506cd),_0x12a238['id']+='\\x20f',_0x9397d1[_0x46fa9c(0x16d)][_0x46fa9c(0x12d)](_0x12a238);}}},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x18a)]=function(_0x2d3e19,_0x46799d){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xe0)]=function(_0x3f0cab){},_0x4ec6f8[_0x5d4413(0xa3)]['_isArray']=function(_0x3dacb5){var _0x350e08=_0x5d4413;return Array[_0x350e08(0x146)](_0x3dacb5)||typeof _0x3dacb5==_0x350e08(0xcb)&&this[_0x350e08(0x148)](_0x3dacb5)===_0x350e08(0x151);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x19a)]=function(_0x10e2b9,_0x1ff96f){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x119)]=function(_0x516e14){var _0x27970f=_0x5d4413;delete _0x516e14[_0x27970f(0x147)],delete _0x516e14[_0x27970f(0x121)],delete _0x516e14[_0x27970f(0x174)];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xe2)]=function(_0x211393,_0x4c093d){};let _0x5a6ee8=new _0x4ec6f8(),_0x58ea8f={'props':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0x16d)]||0x64,'elements':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xd0)]||0x64,'strLength':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0x130)]||0x400*0x32,'totalStrLength':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xd9)]||0x400*0x32,'autoExpandLimit':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xe6)]||0x1388,'autoExpandMaxDepth':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xa2)]||0xa},_0x5794d0={'props':_0x16053c[_0x5d4413(0x131)]['props']||0x5,'elements':_0x16053c['reducedLimits'][_0x5d4413(0xd0)]||0x5,'strLength':_0x16053c[_0x5d4413(0x131)][_0x5d4413(0x130)]||0x100,'totalStrLength':_0x16053c[_0x5d4413(0x131)]['totalStrLength']||0x100*0x3,'autoExpandLimit':_0x16053c[_0x5d4413(0x131)][_0x5d4413(0xe6)]||0x1e,'autoExpandMaxDepth':_0x16053c[_0x5d4413(0x131)]['autoExpandMaxDepth']||0x2};function _0x5d713e(_0x559ec1,_0x3bab4b,_0x2b0326,_0x398253,_0x25fe92,_0x276876){var _0x38c024=_0x5d4413;let _0x42c2fe,_0x3a7f23;try{_0x3a7f23=_0x1c7b58(),_0x42c2fe=_0x47d813[_0x3bab4b],!_0x42c2fe||_0x3a7f23-_0x42c2fe['ts']>_0xee9e24['perLogpoint'][_0x38c024(0xea)]&&_0x42c2fe[_0x38c024(0xed)]&&_0x42c2fe[_0x38c024(0x10f)]/_0x42c2fe['count']<_0xee9e24[_0x38c024(0x154)][_0x38c024(0xaa)]?(_0x47d813[_0x3bab4b]=_0x42c2fe={'count':0x0,'time':0x0,'ts':_0x3a7f23},_0x47d813['hits']={}):_0x3a7f23-_0x47d813[_0x38c024(0x180)]['ts']>_0xee9e24[_0x38c024(0x198)]['resetWhenQuietMs']&&_0x47d813[_0x38c024(0x180)][_0x38c024(0xed)]&&_0x47d813[_0x38c024(0x180)][_0x38c024(0x10f)]/_0x47d813[_0x38c024(0x180)][_0x38c024(0xed)]<_0xee9e24['global']['resetOnProcessingTimeAverageMs']&&(_0x47d813['hits']={});let _0x2beacd=[],_0xa238bf=_0x42c2fe[_0x38c024(0xf2)]||_0x47d813[_0x38c024(0x180)]['reduceLimits']?_0x5794d0:_0x58ea8f,_0x4de305=_0x404b01=>{var _0x295276=_0x38c024;let _0x3d542a={};return _0x3d542a[_0x295276(0x16d)]=_0x404b01['props'],_0x3d542a[_0x295276(0xd0)]=_0x404b01[_0x295276(0xd0)],_0x3d542a[_0x295276(0x130)]=_0x404b01['strLength'],_0x3d542a[_0x295276(0xd9)]=_0x404b01[_0x295276(0xd9)],_0x3d542a['autoExpandLimit']=_0x404b01[_0x295276(0xe6)],_0x3d542a[_0x295276(0xa2)]=_0x404b01[_0x295276(0xa2)],_0x3d542a[_0x295276(0x152)]=!0x1,_0x3d542a[_0x295276(0x125)]=!_0x2e6e58,_0x3d542a[_0x295276(0xeb)]=0x1,_0x3d542a['level']=0x0,_0x3d542a[_0x295276(0x110)]='root_exp_id',_0x3d542a[_0x295276(0x188)]=_0x295276(0x13b),_0x3d542a[_0x295276(0xcd)]=!0x0,_0x3d542a['autoExpandPreviousObjects']=[],_0x3d542a[_0x295276(0x12c)]=0x0,_0x3d542a[_0x295276(0x13f)]=_0x16053c[_0x295276(0x13f)],_0x3d542a[_0x295276(0x181)]=0x0,_0x3d542a[_0x295276(0xd4)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x3d542a;};for(var _0x4701b5=0x0;_0x4701b5<_0x25fe92[_0x38c024(0x197)];_0x4701b5++)_0x2beacd['push'](_0x5a6ee8[_0x38c024(0x105)]({'timeNode':_0x559ec1===_0x38c024(0x10f)||void 0x0},_0x25fe92[_0x4701b5],_0x4de305(_0xa238bf),{}));if(_0x559ec1===_0x38c024(0x124)||_0x559ec1==='error'){let _0x6a96d1=Error[_0x38c024(0xc3)];try{Error[_0x38c024(0xc3)]=0x1/0x0,_0x2beacd['push'](_0x5a6ee8[_0x38c024(0x105)]({'stackNode':!0x0},new Error()[_0x38c024(0xdd)],_0x4de305(_0xa238bf),{'strLength':0x1/0x0}));}finally{Error[_0x38c024(0xc3)]=_0x6a96d1;}}return{'method':'log','version':_0x2fc14c,'args':[{'ts':_0x2b0326,'session':_0x398253,'args':_0x2beacd,'id':_0x3bab4b,'context':_0x276876}]};}catch(_0x288391){return{'method':_0x38c024(0x1a2),'version':_0x2fc14c,'args':[{'ts':_0x2b0326,'session':_0x398253,'args':[{'type':'unknown','error':_0x288391&&_0x288391[_0x38c024(0x19b)]}],'id':_0x3bab4b,'context':_0x276876}]};}finally{try{if(_0x42c2fe&&_0x3a7f23){let _0x5ad3d3=_0x1c7b58();_0x42c2fe[_0x38c024(0xed)]++,_0x42c2fe['time']+=_0x57e37c(_0x3a7f23,_0x5ad3d3),_0x42c2fe['ts']=_0x5ad3d3,_0x47d813['hits']['count']++,_0x47d813[_0x38c024(0x180)]['time']+=_0x57e37c(_0x3a7f23,_0x5ad3d3),_0x47d813[_0x38c024(0x180)]['ts']=_0x5ad3d3,(_0x42c2fe[_0x38c024(0xed)]>_0xee9e24[_0x38c024(0x154)][_0x38c024(0xc6)]||_0x42c2fe['time']>_0xee9e24['perLogpoint'][_0x38c024(0x122)])&&(_0x42c2fe[_0x38c024(0xf2)]=!0x0),(_0x47d813[_0x38c024(0x180)][_0x38c024(0xed)]>_0xee9e24['global']['reduceOnCount']||_0x47d813[_0x38c024(0x180)][_0x38c024(0x10f)]>_0xee9e24[_0x38c024(0x198)]['reduceOnAccumulatedProcessingTimeMs'])&&(_0x47d813[_0x38c024(0x180)][_0x38c024(0xf2)]=!0x0);}}catch{}}}return _0x5d713e;}((_0x203b5a,_0x30b7c7,_0x324cef,_0x27f652,_0x48e15b,_0x5bb317,_0x3fb50f,_0x343a8,_0x49d5d3,_0x205017,_0x264412,_0x476e4f)=>{var _0x37c213=_0x206025;if(_0x203b5a[_0x37c213(0x14e)])return _0x203b5a[_0x37c213(0x14e)];let _0x591ad1={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!H(_0x203b5a,_0x343a8,_0x48e15b))return _0x203b5a[_0x37c213(0x14e)]=_0x591ad1,_0x203b5a['_console_ninja'];let _0x540ede=B(_0x203b5a),_0x468f43=_0x540ede[_0x37c213(0x12b)],_0x514c25=_0x540ede[_0x37c213(0xec)],_0x53eba8=_0x540ede[_0x37c213(0xd1)],_0x1585a8={'hits':{},'ts':{}},_0x2e4709=X(_0x203b5a,_0x49d5d3,_0x1585a8,_0x5bb317,_0x476e4f),_0x2898c2=(_0x163a2f,_0x3623fa,_0x3f5713,_0x316379,_0x1b0b41,_0x564147)=>{var _0x4f1607=_0x37c213;let _0x3730c8=_0x203b5a[_0x4f1607(0x14e)];try{return _0x203b5a[_0x4f1607(0x14e)]=_0x591ad1,_0x2e4709(_0x163a2f,_0x3623fa,_0x3f5713,_0x316379,_0x1b0b41,_0x564147);}finally{_0x203b5a[_0x4f1607(0x14e)]=_0x3730c8;}},_0x14f15a=_0x1ee0b5=>{_0x1585a8['ts'][_0x1ee0b5]=_0x514c25();},_0x2c00f7=(_0x26ccbf,_0x14ea2f)=>{let _0x48585e=_0x1585a8['ts'][_0x14ea2f];if(delete _0x1585a8['ts'][_0x14ea2f],_0x48585e){let _0xac0e=_0x468f43(_0x48585e,_0x514c25());_0x1941f0(_0x2898c2('time',_0x26ccbf,_0x53eba8(),_0x17718d,[_0xac0e],_0x14ea2f));}},_0x31320e=_0x3349e3=>{var _0xc2d4c3=_0x37c213,_0x1a6fc7;return _0x48e15b==='next.js'&&_0x203b5a[_0xc2d4c3(0xca)]&&((_0x1a6fc7=_0x3349e3==null?void 0x0:_0x3349e3[_0xc2d4c3(0x113)])==null?void 0x0:_0x1a6fc7[_0xc2d4c3(0x197)])&&(_0x3349e3['args'][0x0][_0xc2d4c3(0xca)]=_0x203b5a[_0xc2d4c3(0xca)]),_0x3349e3;};_0x203b5a[_0x37c213(0x14e)]={'consoleLog':(_0x587d5a,_0x4a2aed)=>{var _0x14d3d4=_0x37c213;_0x203b5a[_0x14d3d4(0x15b)]['log'][_0x14d3d4(0x12f)]!=='disabledLog'&&_0x1941f0(_0x2898c2(_0x14d3d4(0x1a2),_0x587d5a,_0x53eba8(),_0x17718d,_0x4a2aed));},'consoleTrace':(_0x41ced6,_0x4beb53)=>{var _0x490de8=_0x37c213,_0x437ded,_0x2f3a5c;_0x203b5a[_0x490de8(0x15b)][_0x490de8(0x1a2)][_0x490de8(0x12f)]!==_0x490de8(0x14f)&&((_0x2f3a5c=(_0x437ded=_0x203b5a[_0x490de8(0x128)])==null?void 0x0:_0x437ded[_0x490de8(0x13c)])!=null&&_0x2f3a5c[_0x490de8(0xd4)]&&(_0x203b5a[_0x490de8(0x196)]=!0x0),_0x1941f0(_0x31320e(_0x2898c2(_0x490de8(0x124),_0x41ced6,_0x53eba8(),_0x17718d,_0x4beb53))));},'consoleError':(_0x4816b9,_0x8b9537)=>{var _0x11a235=_0x37c213;_0x203b5a[_0x11a235(0x196)]=!0x0,_0x1941f0(_0x31320e(_0x2898c2(_0x11a235(0x118),_0x4816b9,_0x53eba8(),_0x17718d,_0x8b9537)));},'consoleTime':_0x5d5cdd=>{_0x14f15a(_0x5d5cdd);},'consoleTimeEnd':(_0x509cca,_0x533215)=>{_0x2c00f7(_0x533215,_0x509cca);},'autoLog':(_0x3e3e0e,_0x239569)=>{_0x1941f0(_0x2898c2('log',_0x239569,_0x53eba8(),_0x17718d,[_0x3e3e0e]));},'autoLogMany':(_0x5396f2,_0x2e21a4)=>{var _0x24649c=_0x37c213;_0x1941f0(_0x2898c2(_0x24649c(0x1a2),_0x5396f2,_0x53eba8(),_0x17718d,_0x2e21a4));},'autoTrace':(_0xc5a86f,_0x284f0e)=>{var _0x19371e=_0x37c213;_0x1941f0(_0x31320e(_0x2898c2(_0x19371e(0x124),_0x284f0e,_0x53eba8(),_0x17718d,[_0xc5a86f])));},'autoTraceMany':(_0x2186d5,_0x539807)=>{_0x1941f0(_0x31320e(_0x2898c2('trace',_0x2186d5,_0x53eba8(),_0x17718d,_0x539807)));},'autoTime':(_0x1b9356,_0x1765d1,_0x1fe25f)=>{_0x14f15a(_0x1fe25f);},'autoTimeEnd':(_0x1a985f,_0x4488ae,_0x49e434)=>{_0x2c00f7(_0x4488ae,_0x49e434);},'coverage':_0x33489e=>{var _0x32d229=_0x37c213;_0x1941f0({'method':_0x32d229(0xad),'version':_0x5bb317,'args':[{'id':_0x33489e}]});}};let _0x1941f0=q(_0x203b5a,_0x30b7c7,_0x324cef,_0x27f652,_0x48e15b,_0x205017,_0x264412),_0x17718d=_0x203b5a[_0x37c213(0x14a)];return _0x203b5a[_0x37c213(0x14e)];})(globalThis,'127.0.0.1',_0x206025(0x163),_0x206025(0x166),'next.js',_0x206025(0x135),_0x206025(0x177),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"10.0.2.2\",\"Aashish\",\"192.168.1.4\"],'',_0x206025(0xfe),_0x206025(0x156),_0x206025(0x12e));");
    } catch (e) {
        console.error(e);
    }
}
; /* istanbul ignore next */ 
function oo_oo(/**@type{any}**/ i, /**@type{any}**/ ...v) {
    try {
        oo_cm().consoleLog(i, v);
    } catch (e) {}
    return v;
}
; /* istanbul ignore next */ 
function oo_tr(/**@type{any}**/ i, /**@type{any}**/ ...v) {
    try {
        oo_cm().consoleTrace(i, v);
    } catch (e) {}
    return v;
}
; /* istanbul ignore next */ 
function oo_tx(/**@type{any}**/ i, /**@type{any}**/ ...v) {
    try {
        oo_cm().consoleError(i, v);
    } catch (e) {}
    return v;
}
; /* istanbul ignore next */ 
function oo_ts(/**@type{any}**/ v) {
    try {
        oo_cm().consoleTime(v);
    } catch (e) {}
    return v;
}
; /* istanbul ignore next */ 
function oo_te(/**@type{any}**/ v, /**@type{any}**/ i) {
    try {
        oo_cm().consoleTimeEnd(v, i);
    } catch (e) {}
    return v;
}
; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/ 
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/snmlogo.jpeg (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/snmlogo.554f6bdb.jpeg");}}),
"[project]/public/snmlogo.jpeg.mjs { IMAGE => \"[project]/public/snmlogo.jpeg (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$snmlogo$2e$jpeg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/snmlogo.jpeg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$snmlogo$2e$jpeg__$28$static__in__ecmascript$29$__["default"],
    width: 220,
    height: 220,
    blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCAAIAAgDAREAAhEBAxEB/9sAQwAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47/9sAQwEKCwsODQ4cEBAcOygiKDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDesxrP9rTZaAXxc8zBi45/h/ziu+XsrLe1vxPLgq93tzX632P/2Q==",
    blurWidth: 8,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Doctors.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Doctors.92bbf3ac.png");}}),
"[project]/public/Doctors.png.mjs { IMAGE => \"[project]/public/Doctors.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Doctors$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Doctors.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Doctors$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 840,
    height: 813,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA/0lEQVR42iWPTSsEAQCG5+9QkovLXrT5AUqKHLQ5OAgHIvIHJIqDRJLEHLVNM1E+Yudg1+40iRKrMWaX1DYYY2dmR/OY2X2P7/P01isQxw5+2L5VGFwap28hw4YuUfOdBCF8N+os6iLd6yNk+ntIpzpoXx5iVtvnM3ARjqw8XcoM6d0xymeblLKrpLZG6ZSnEV9UhMRsk6ZIS3M8FA940g7pleeb3cTNTksYuFxhr3SOoam83V0j6jmG1TUmi7EgVzWOTZ3HcgXjVMG6OMG0Prh6vydrFRD8vwa26/JsVKkU4oV8DtN8pfZl48VMSK5EUUTdC3CcX3zPIwzDZpfkHzSBzJe5VCARAAAAAElFTkSuQmCC",
    blurWidth: 8,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Nurse.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Nurse.577185f4.png");}}),
"[project]/public/Nurse.png.mjs { IMAGE => \"[project]/public/Nurse.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Nurse$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Nurse.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Nurse$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 511,
    height: 723,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAICAYAAADaxo44AAAAw0lEQVR42j2KTYsBcQCH/19u2+Oe97x7mNrDtqctNwcheS0vjRgKxZCDGwdSDkSUL+AtUdIMM42J8Xg5+NVz+T2P4L7Z9oQ6sKkOTqx29uNCOOczrUKeuDfF/9cvjXSCq+MgLrbFslVG66hM026mlQSPWFj6nrHi59CtobcrjBQftmkgjppOIRhkWFLo5WSK4RCmcReNyQUpZyHF5nxHF3zGNtT7GsKlWnxETN4DxpM3z5q/7AqRbGr8ZLYvJHmN3NxxA6MVmuVnFXtBAAAAAElFTkSuQmCC",
    blurWidth: 6,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Dressing.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Dressing.5c2d2841.png");}}),
"[project]/public/Dressing.png.mjs { IMAGE => \"[project]/public/Dressing.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Dressing$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Dressing.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Dressing$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 795,
    height: 802,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA20lEQVR42iWOv8pHYBzFn1v4TcoVsCi7CzDZlMkgZqPBJjdgUq6BMiollMVicAsmA6XkTzhvz/MO3+Wc7/mcQ77vA71pmjDPM57nQRiG8H0f932DUKHve2iaxsTjOBDHMUzTxDAMIOM4QpZlcBwHx3FQVRXyPIeiKDAMAySKIvx+P4iiiK7rUJYlsiyDqqqQJAkkTVNmCoIASruuC9u2sTrP8/43JEkCnudZ777vOM8TlmWhbVuQ933ZAzV1XceyLGy9bdtomgaEIimqKAq4rot1XUFDQRCgrmv8AaI4t2RjOM5HAAAAAElFTkSuQmCC",
    blurWidth: 8,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Paramedical.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Paramedical.afa90903.png");}}),
"[project]/public/Paramedical.png.mjs { IMAGE => \"[project]/public/Paramedical.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Paramedical$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Paramedical.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Paramedical$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 840,
    height: 814,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA9UlEQVR42lWLPS8DYQCAX0t/CzHyI5gkIgZLE1N16UIMgoiNaCJpxGl9tDRyfZ346rXnjTc+0goJuaFC0hi4ASuJnLtcHhoLz/BMzyP44bF5T8XMcK72CcOQv4goirhwJJ8PO1zZBm+vL/+D1nFmF/lq7nJTNfCen/B9nyAIfoOWLmunlDdmKObSuK6LlBLLsvA8D3F916B3aoLuvh66BgdYzefRWqOUorC5hRgrrNE2N4kY6ieWiJPOZalXj6mdaJaNFURqPYtYnEUk48RGk5ScCh+6zvttg72DQ8SCuU3H9DjtiWE6UyPML2VQR2Uc28YsSb4BFFjGSrKTxO8AAAAASUVORK5CYII=",
    blurWidth: 8,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Pathology.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Pathology.5378f76d.png");}}),
"[project]/public/Pathology.png.mjs { IMAGE => \"[project]/public/Pathology.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pathology$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Pathology.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pathology$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 568,
    height: 553,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA70lEQVR42kXPPUvDUACF4fxLncTZxUnoIoKD2IKDSnVRrIodNCKi1MGldLCKJW0QxKSDxpimSW4+Gr1J7fIaqNDhbM+Bc5TfyQSZJPx82MhRiswyAiFIkhFRHKPkMiM8UQnXthAXt0SfNo3TOo4zwC+gkqffiPIe8eY+7kYVZ/cAfb1CXLSnYDwm0l7wjs4R9y3MpRWaah3DMGfADz2010fuGtfY7Qe+zB5atzsFMpe0OjWOLxeoqWV6NzsIdRHX6uMHQQEySfP5kLOreVrVVdxSCbE8x7CyzfCtj5IWIy3nHd1oY3U1Bk//6eh4xZM/zWTbIa+hK+AAAAAASUVORK5CYII=",
    blurWidth: 8,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Acupressure.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Acupressure.35bd303b.png");}}),
"[project]/public/Acupressure.png.mjs { IMAGE => \"[project]/public/Acupressure.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Acupressure$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Acupressure.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Acupressure$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 540,
    height: 643,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAICAYAAAA1BOUGAAAAsUlEQVR42kWOyQ6CQBBE+f/v0JMmxkRN1Hj24MF4UNxYJIIssg0g2wzlzHDg0N1JvaTrKV3XgTKGW0ywMlxoaQ7GM5ErAhz9GOOrhbFqYfa0Uba0hxWlmNzfGF0sTB82FvoHRdMOcMmDrelhZ/qYaw42Lw/Br+rhwYughgR7J8TadGV3UtVQGsokPAcpjG+Bk5/AIoWUUsRvnRsaSQ6HlFAjMtiKlXGBuGyQ1fxWjQRi/jOy0cfC7VHfAAAAAElFTkSuQmCC",
    blurWidth: 7,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Pharmacy.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Pharmacy.d489e0da.png");}}),
"[project]/public/Pharmacy.png.mjs { IMAGE => \"[project]/public/Pharmacy.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pharmacy$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Pharmacy.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pharmacy$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 777,
    height: 700,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAA1ElEQVR42k2MPUsCcQCH/5+srxDUULQEDSa0eIU0xFlhEWJxhXgEXvaXOt854UQEvVPBxRt11fFGFcT9Ht8GfYYf/ODhEazxfR9pSGRG4rQcDhGbmYwnaEkN/TONVbUIgmAvbI7ruNilb6zfGKW8ycjzWC4WO2E6n3H3lUJNhMjpZ1wpUYaRKAP5ty0JJf3CaTzC0dM957UOF5pB7zaEpsax3R7i+DGMknrmZC0ZXY+PTIJm+ZqbnwKXuokotm3C7w+oyVca9QaF/yyVXIw3I4vp9lkBrpSrB1MVAooAAAAASUVORK5CYII=",
    blurWidth: 8,
    blurHeight: 7
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Physiotherapy.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Physiotherapy.aa0aefee.png");}}),
"[project]/public/Physiotherapy.png.mjs { IMAGE => \"[project]/public/Physiotherapy.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Physiotherapy$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Physiotherapy.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Physiotherapy$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 597,
    height: 562,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA2UlEQVR42h2Py0rDUBBA7w+7diXuBVd+gqu6Exe+KoIQi42RoI2V0Nha24DRYts0j9vc3NNMBs7AMGdmGEUT1lpKvWWdFS1ZUVLXtbRQkqQotGb+u8QfxeSlZpOLZFGVMQjW1rjDiBt3SLmt2iHToGSdCJs0od89YPB4TJan6Mq05xpBY0zNKnlj0j9k4Bzhht/cB3OePxOU3BLi6Jqnqz38dx/vY8qlG+KJ4IUzOnceJ7cv7HcuOOsFOK9jwq8Ff8sUNf355/zB59QZ0Q1iesGYaJYwiRftNzvj8uoWF63t7QAAAABJRU5ErkJggg==",
    blurWidth: 8,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Homeopathy.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Homeopathy.9c651c1e.png");}}),
"[project]/public/Homeopathy.png.mjs { IMAGE => \"[project]/public/Homeopathy.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Homeopathy$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Homeopathy.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Homeopathy$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 396,
    height: 378,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA8UlEQVR42kWPPUtCYQCF779oiv5AW0tDm2vQVBANUUs0Fg0JEQ0FjQ7RUGhCUA0hRQ2RDjkEdetK4B2aKkO9Kqh49VXvx/s+Kn6d4QwPZ3iOxiBSSSrNIpadwVf+EKP1ypUO36U0EWOXvec1Ujkd12/3B67vEDPPCBtbBBMzzEenOX3b4cI4oukKtLIocfyyzeL1JBsPEwTOp1i/nWUztsR/9Q/Nky1O3ldZvppj/2mFUPKAw3iQhWgAq5bvOSg+c/c8pi+5e00Q/0pyk4oQ1kN40utLel3JbOWXTPEH0/rALOg0HHv8YhjREtSFjVJqxDpZM9iVsn1psgAAAABJRU5ErkJggg==",
    blurWidth: 8,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Ambulance.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Ambulance.ad6ec291.png");}}),
"[project]/public/Ambulance.png.mjs { IMAGE => \"[project]/public/Ambulance.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Ambulance$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Ambulance.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Ambulance$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 690,
    height: 502,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAmklEQVR42iXOrxGCAABGcZzBYnILg6fFAZzB4Jn8k9xATzfQCQye2ebZqAQ6gQWACnfwE+TL7773AmVJUZDnZBmfD2lKVekWeDyYzZjPWa2YTLjdCEOapgWuVwYDplO+XzYbTifO5/9T4HJhOGSx4PlkuWQ8ZjTifm+B95vDgd2O45H1mu2W/Z7XqwVajyQhjvuwLjqK+tC69gOBQJmnfgm8gwAAAABJRU5ErkJggg==",
    blurWidth: 8,
    blurHeight: 6
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Registration.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Registration.146176b4.png");}}),
"[project]/public/Registration.png.mjs { IMAGE => \"[project]/public/Registration.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Registration$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Registration.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Registration$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 385,
    height: 432,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAICAYAAAA1BOUGAAAA3klEQVR42j3Py0oCYQDF8e8NepUeohYtw0WXV5AIaxktwkUQ4SK6UQsNTBfODJnjbaGCqCjiBUVBRAUR5+JyVsMw/L3igbP6nc0RUknl4vWKWqeBpuubWpbFOuL6654D3yH+4BtyMkex3qFcqeK6LqI76PMihfHe3OE5PV8N8vz4vGjjEUI3DMrNHu/+JwKeM9RMnr/HE6bD9hb/swVCUYXvUARZTZMOHDMb7VBKZPkIRvhc4W9MIfV8tEXTXKAkMoRj8U2jcpyH20umkyHCcRwM09zfmGsazVYb27ZZAsDmsVAIBwy9AAAAAElFTkSuQmCC",
    blurWidth: 7,
    blurHeight: 8
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/public/Lab-Tech.png (static in ecmascript)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v("/_next/static/media/Lab-Tech.14f3140a.png");}}),
"[project]/public/Lab-Tech.png.mjs { IMAGE => \"[project]/public/Lab-Tech.png (static in ecmascript)\" } [app-client] (structured image object, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Lab$2d$Tech$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/public/Lab-Tech.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Lab$2d$Tech$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 529,
    height: 490,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAAyUlEQVR42h2Lr85FcACGfxdw+rmA8yefcILENMEUm83mAkRXQDCKILsJU4ykqrqPTUBTzYTn+z5PevfueQR/nOdJ13X0/Q+2bVPX9fX9I47joCxLoihiGAZ830dVVZIkYd93xDzPeJ5HVVWM40jbtiiKwv1+v7bIsozH48Hz+UTTNFzXxXEcbrcbeZ4j+r7n9XohhEDXdUzT5Pv98vl8SNMUMU0T7/f7EgzDQJZl4jimKAqWZUGs64plWUiSRBiGBEFwlU3TsG0bv6BPkwIgu95KAAAAAElFTkSuQmCC",
    blurWidth: 8,
    blurHeight: 7
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/dashboard/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Dashboard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [app-client] (ecmascript)");
// Chart.js components
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chartjs-2/dist/index.js [app-client] (ecmascript)");
// Icons
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/io/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bs$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/bs/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
// Images
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$snmlogo$2e$jpeg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$snmlogo$2e$jpeg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/snmlogo.jpeg.mjs { IMAGE => "[project]/public/snmlogo.jpeg (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Doctors$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Doctors$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Doctors.png.mjs { IMAGE => "[project]/public/Doctors.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Nurse$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Nurse$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Nurse.png.mjs { IMAGE => "[project]/public/Nurse.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Dressing$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Dressing$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Dressing.png.mjs { IMAGE => "[project]/public/Dressing.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Paramedical$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Paramedical$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Paramedical.png.mjs { IMAGE => "[project]/public/Paramedical.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pathology$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Pathology$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Pathology.png.mjs { IMAGE => "[project]/public/Pathology.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Acupressure$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Acupressure$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Acupressure.png.mjs { IMAGE => "[project]/public/Acupressure.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pharmacy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Pharmacy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Pharmacy.png.mjs { IMAGE => "[project]/public/Pharmacy.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Physiotherapy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Physiotherapy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Physiotherapy.png.mjs { IMAGE => "[project]/public/Physiotherapy.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Homeopathy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Homeopathy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Homeopathy.png.mjs { IMAGE => "[project]/public/Homeopathy.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Ambulance$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Ambulance$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Ambulance.png.mjs { IMAGE => "[project]/public/Ambulance.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Registration$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Registration$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Registration.png.mjs { IMAGE => "[project]/public/Registration.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Lab$2d$Tech$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Lab$2d$Tech$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/Lab-Tech.png.mjs { IMAGE => "[project]/public/Lab-Tech.png (static in ecmascript)" } [app-client] (structured image object, ecmascript)');
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BarElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ArcElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Title"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"]);
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Department image mapping
const departmentImages = {
    'Admin': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Doctors$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Doctors$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Doctors': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Doctors$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Doctors$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Nursing': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Nurse$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Nurse$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Nurses': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Nurse$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Nurse$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Dressing': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Dressing$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Dressing$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Paramedical': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Paramedical$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Paramedical$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Pathology': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pathology$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Pathology$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Acupuncture': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Acupressure$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Acupressure$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Accupressure': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Acupressure$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Acupressure$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Pharmacy': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pharmacy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Pharmacy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Physiotherapy': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Physiotherapy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Physiotherapy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Homeopathy': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Homeopathy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Homeopathy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Ambulance': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Ambulance$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Ambulance$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Registration': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Registration$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Registration$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Lab': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Lab$2d$Tech$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Lab$2d$Tech$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
    'Lab-Tech': __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Lab$2d$Tech$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Lab$2d$Tech$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
};
function Dashboard() {
    _s();
    const [selectedMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('JUL');
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('home');
    const [profileImage, setProfileImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showReports, setShowReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    //  Dynamic data states
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: 'Mr. Pratik Ji',
        role: 'Medical Sewadar',
        qualification: 'MBA, MD',
        email: '',
        mobile: '',
        department: '',
        profileImage: null
    });
    const fixImageSrc = (src)=>{
        if (!src) return null;
        // If it's already a valid URL format, return as is
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('/')) {
            return src;
        }
        // Add leading slash to relative paths
        return '/' + src;
    };
    const [statsData, setStatsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        // Default fallback data with your preferred structure
        {
            title: 'Doctors',
            value: 520,
            color: '#EC4899',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Doctors$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Doctors$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Nurses',
            value: 5959,
            color: '#3B82F6',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Nurse$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Nurse$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Dressing',
            value: 520,
            color: '#F59E0B',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Dressing$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Dressing$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Paramedical',
            value: 5969,
            color: '#10B981',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Paramedical$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Paramedical$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Pathology',
            value: 520,
            color: '#8B5CF6',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pathology$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Pathology$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Acupuncture',
            value: 6969,
            color: '#06B6D4',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Acupressure$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Acupressure$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Pharmacy',
            value: 7509,
            color: '#EC4899',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Pharmacy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Pharmacy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Physiotherapy',
            value: 2110,
            color: '#3B82F6',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Physiotherapy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Physiotherapy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Homeopathy',
            value: 7509,
            color: '#F59E0B',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Homeopathy$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Homeopathy$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Ambulance',
            value: 2110,
            color: '#10B981',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Ambulance$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Ambulance$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Registration',
            value: 7509,
            color: '#8B5CF6',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Registration$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Registration$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        },
        {
            title: 'Lab-Tech',
            value: 2110,
            color: '#06B6D4',
            image: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Lab$2d$Tech$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Lab$2d$Tech$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
        }
    ]);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reportsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    //  Fetch real data from backend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            const fetchDashboardData = {
                "Dashboard.useEffect.fetchDashboardData": async ()=>{
                    try {
                        setLoading(true);
                        setError('');
                        // Check authentication
                        const token = localStorage.getItem('token');
                        if (!token) {
                            router.push('/login');
                            return;
                        }
                        /* eslint-disable */ console.log(...oo_oo(`1138572786_139_8_139_50_4`, ' Fetching dashboard data...'));
                        // Fetch user profile and dashboard stats
                        const [profileResponse, statsResponse] = await Promise.all([
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getUserProfile().catch({
                                "Dashboard.useEffect.fetchDashboardData": (err)=>({
                                        success: false,
                                        error: err.message
                                    })
                            }["Dashboard.useEffect.fetchDashboardData"]),
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getDashboardStats().catch({
                                "Dashboard.useEffect.fetchDashboardData": (err)=>({
                                        success: false,
                                        error: err.message
                                    })
                            }["Dashboard.useEffect.fetchDashboardData"])
                        ]);
                        // Update user data if successful
                        if (profileResponse.success && profileResponse.data) {
                            setUserData({
                                name: profileResponse.data.name || 'Mr. Pratik Ji',
                                role: profileResponse.data.role || 'Medical Sewadar',
                                qualification: profileResponse.data.qualification || 'MBA, MD',
                                email: profileResponse.data.email || '',
                                mobile: profileResponse.data.mobile || '',
                                department: profileResponse.data.department || '',
                                profileImage: profileResponse.data.profileImage || null
                            });
                            // Update profile image state
                            if (profileResponse.data.profileImage) {
                                setProfileImage(profileResponse.data.profileImage);
                            }
                            /* eslint-disable */ console.log(...oo_oo(`1138572786_164_10_164_73_4`, ' User profile loaded:', profileResponse.data.name));
                        }
                        // Update stats data if successful
                        if (statsResponse.success && statsResponse.data && statsResponse.data.stats) {
                            const mappedStats = statsResponse.data.stats.map({
                                "Dashboard.useEffect.fetchDashboardData.mappedStats": (stat, index)=>({
                                        title: stat.title,
                                        value: stat.value || 0,
                                        color: stat.color || '#6B7280',
                                        image: departmentImages[stat.title] || departmentImages['Doctors'] || __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Doctors$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Doctors$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"]
                                    })
                            }["Dashboard.useEffect.fetchDashboardData.mappedStats"]);
                            // Ensure we have exactly 12 items to match your static layout
                            while(mappedStats.length < 12){
                                const fallbackStat = statsData[mappedStats.length % statsData.length];
                                mappedStats.push({
                                    title: fallbackStat.title,
                                    value: 0,
                                    color: fallbackStat.color,
                                    image: fallbackStat.image
                                });
                            }
                            setStatsData(mappedStats.slice(0, 12)); // Keep exactly 12 items
                            /* eslint-disable */ console.log(...oo_oo(`1138572786_188_10_188_84_4`, ' Dashboard stats loaded:', mappedStats.length, 'departments'));
                        }
                    } catch (err) {
                        /* eslint-disable */ console.error(...oo_tx(`1138572786_192_8_192_58_11`, ' Dashboard data fetch error:', err));
                        setError('Unable to load some dashboard data. Using cached information.');
                    // Don't redirect on error, just show error message and use fallback data
                    } finally{
                        setLoading(false);
                    }
                }
            }["Dashboard.useEffect.fetchDashboardData"];
            fetchDashboardData();
        }
    }["Dashboard.useEffect"], [
        router
    ]);
    // Navigation items
    const navItems = [
        {
            id: 'home',
            href: '/',
            name: 'Home'
        },
        {
            id: 'update-profile',
            href: '/registrationpage',
            name: 'Update Profile'
        },
        {
            id: 'master-search',
            href: '/master',
            name: 'Master Search'
        },
        {
            id: 'duty-chart',
            href: '/DutyChart',
            name: 'Duty Chart'
        },
        {
            id: 'reports',
            name: 'Reports',
            children: [
                {
                    id: 'daily-report',
                    href: '/daily-report',
                    name: 'Daily Report'
                },
                {
                    id: 'registration-report',
                    href: '/registration-report',
                    name: 'Registration Report'
                },
                {
                    id: 'master-report',
                    href: '/master-report',
                    name: 'Master Report'
                }
            ]
        },
        {
            id: 'sign-out',
            name: 'Sign Out'
        }
    ];
    // Define services for the footer
    const services = [
        {
            title: 'Medical Camps'
        },
        {
            title: 'Outreach Programs'
        },
        {
            title: 'Patient Care'
        },
        {
            title: 'Pathology'
        },
        {
            title: 'Pharmacy'
        },
        {
            title: 'Physiotherapy'
        },
        {
            title: 'Homeopathy'
        },
        {
            title: 'Ambulance Services'
        },
        {
            title: 'Acupuncture'
        },
        {
            title: 'Dressing'
        },
        {
            title: 'Paramedical Services'
        },
        {
            title: 'Registration'
        },
        {
            title: 'Lab Technician Services'
        }
    ];
    //  Logout function
    const handleLogout = async ()=>{
        try {
            /* eslint-disable */ console.log(...oo_oo(`1138572786_242_6_242_41_4`, ' Logging out user...'));
            localStorage.clear();
            sessionStorage.clear();
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].logout();
            } catch (apiError) {
                console.warn('API logout failed:', apiError);
            }
            /* eslint-disable */ console.log(...oo_oo(`1138572786_252_6_252_50_4`, ' User logged out successfully'));
            window.location.href = '/login';
        } catch (error) {
            /* eslint-disable */ console.error(...oo_tx(`1138572786_256_6_256_44_11`, ' Logout error:', error));
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
        }
    };
    // Handle profile image upload
    const handleImageUpload = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event)=>{
                if (event.target?.result) {
                    setProfileImage(event.target.result);
                    // Update userData as well
                    setUserData((prev)=>({
                            ...prev,
                            profileImage: event.target.result
                        }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    // Trigger file input click
    const handleProfileClick = ()=>{
        fileInputRef.current?.click();
    };
    // Close reports dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            const handleClickOutside = {
                "Dashboard.useEffect.handleClickOutside": (event)=>{
                    if (reportsRef.current && !reportsRef.current.contains(event.target)) {
                        setShowReports(false);
                    }
                }
            }["Dashboard.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "Dashboard.useEffect": ()=>{
                    document.removeEventListener('mousedown', handleClickOutside);
                }
            })["Dashboard.useEffect"];
        }
    }["Dashboard.useEffect"], []);
    // Check if any report child is active
    const isReportChildActive = navItems.find((item)=>item.id === 'reports')?.children?.some((child)=>child.id === activeTab) || false;
    //  Handle navigation with sign-out
    const handleTabClick = (id)=>{
        /* eslint-disable */ console.log(...oo_oo(`1138572786_305_4_305_43_4`, ' Navigation clicked:', id));
        if (id === 'reports') {
            setShowReports(!showReports);
        } else if (id === 'sign-out') {
            /* eslint-disable */ console.log(...oo_oo(`1138572786_310_6_310_38_4`, ' Sign out clicked'));
            handleLogout();
        } else {
            setActiveTab(id);
            setShowReports(false);
            setIsMenuOpen(false);
            const item = navItems.find((item)=>item.id === id);
            if (item?.href) {
                window.location.href = item.href;
            }
        }
    };
    // Extract data for charts
    const chartLabels = statsData.map((stat)=>stat.title);
    const chartData = statsData.map((stat)=>stat.value);
    const chartColors = statsData.map((stat)=>stat.color);
    //  Loading overlay (subtle, preserves your UI)
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex flex-col bg-gray-50 font-sans",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 334,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: "Loading your dashboard..."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 335,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 333,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 332,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/page.tsx",
            lineNumber: 331,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col bg-gray-50 font-sans",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-yellow-50 border-l-4 border-yellow-400 p-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-yellow-700",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 349,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 348,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 347,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 346,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 shadow-lg py-3 sticky top-0 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-8xl mx-auto px-4 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-full p-1 flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-8 h-8 sm:w-10 sm:h-10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$snmlogo$2e$jpeg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$snmlogo$2e$jpeg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
                                            alt: "Medical Sewa Logo",
                                            layout: "fill",
                                            objectFit: "contain",
                                            className: "rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 362,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 361,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 360,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-lg sm:text-xl md:text-2xl font-bold text-white",
                                    children: "Medical Sewa"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 371,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 359,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "hidden lg:flex items-center space-x-1",
                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative group",
                                    ref: item.id === 'reports' ? reportsRef : null,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleTabClick(item.id),
                                            className: `px-3 py-2 font-medium whitespace-nowrap rounded-md transition-all flex items-center
                    ${activeTab === item.id || item.id === 'reports' && (showReports || isReportChildActive) ? "bg-white text-indigo-700 shadow-inner" : 'text-white hover:text-purple-900 hover:bg-white/90'}`,
                                            children: [
                                                item.name,
                                                item.children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1",
                                                    children: showReports ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoIosArrowUp"], {}, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 391,
                                                        columnNumber: 38
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoIosArrowDown"], {}, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 391,
                                                        columnNumber: 57
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 378,
                                            columnNumber: 17
                                        }, this),
                                        item.children && showReports && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-full left-0 w-48 bg-white shadow-xl rounded-md overflow-hidden z-20 border border-gray-200",
                                            children: item.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setActiveTab(child.id);
                                                        setShowReports(false);
                                                        if (child.href) {
                                                            window.location.href = child.href;
                                                        }
                                                    },
                                                    className: `w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center border-b border-gray-100 last:border-b-0
                          ${activeTab === child.id ? 'bg-purple-50 text-purple-700 font-medium' : ''}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2",
                                                        children: child.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 25
                                                    }, this)
                                                }, child.id, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 377,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 375,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setIsMenuOpen(!isMenuOpen),
                            className: "lg:hidden text-white p-2 rounded-md",
                            children: isMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                className: "h-6 w-6"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 425,
                                columnNumber: 27
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBars"], {
                                className: "h-6 w-6"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 425,
                                columnNumber: 61
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 421,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 357,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, this),
            isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-40 lg:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-opacity-30 backdrop-blur-sm",
                        onClick: ()=>setIsMenuOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 433,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-purple-800/90 to-pink-600/90 shadow-xl backdrop-blur-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 flex justify-between items-center border-b border-white/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white rounded-full p-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative w-8 h-8",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$snmlogo$2e$jpeg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$snmlogo$2e$jpeg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
                                                            alt: "Medical Sewa Logo",
                                                            layout: "fill",
                                                            objectFit: "contain",
                                                            className: "rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 443,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 442,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 441,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white font-bold",
                                                    children: "Medical Sewa"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 440,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setIsMenuOpen(false),
                                            className: "text-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 455,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 454,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 439,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "py-4 overflow-y-auto h-full",
                                    children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleTabClick(item.id),
                                                    className: `w-full px-6 py-4 text-left font-medium flex items-center justify-between
                        ${activeTab === item.id || item.id === 'reports' && (showReports || isReportChildActive) ? "bg-white/20 text-white" : 'text-white/90 hover:bg-white/10'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: item.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 472,
                                                            columnNumber: 23
                                                        }, this),
                                                        item.children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: showReports ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoIosArrowUp"], {}, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 475,
                                                                columnNumber: 42
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoIosArrowDown"], {}, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 475,
                                                                columnNumber: 61
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 474,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 21
                                                }, this),
                                                item.children && showReports && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pl-6 bg-purple-900/30",
                                                    children: item.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setActiveTab(child.id);
                                                                setShowReports(false);
                                                                if (child.href) {
                                                                    window.location.href = child.href;
                                                                }
                                                            },
                                                            className: `w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 transition-colors flex items-center
                              ${activeTab === child.id ? 'bg-white/20' : ''}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                children: child.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 496,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, child.id, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 484,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 482,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 461,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 459,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 437,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 432,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 max-w-9xl mx-auto w-full px-1 py-1 space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl shadow-lg overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col p-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row items-start gap-4 w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative group w-full flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-1.5 cursor-pointer flex justify-center",
                                                        onClick: handleProfileClick,
                                                        children: [
                                                            profileImage || userData.profileImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 sm:w-40 sm:h-40 overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: fixImageSrc(profileImage || userData.profileImage) || '/default-avatar.png',
                                                                    alt: "Profile",
                                                                    width: 160,
                                                                    height: 160,
                                                                    className: "w-full h-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 522,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 21
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bs$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BsFillPersonFill"], {
                                                                    className: "h-16 w-16 text-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 532,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 531,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-full overflow-hidden border-2 border-white",
                                                                children: userData?.profileImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: fixImageSrc(userData.profileImage) || '/default-avatar.png',
                                                                    alt: "Profile",
                                                                    width: 40,
                                                                    height: 40,
                                                                    className: "w-full h-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 538,
                                                                    columnNumber: 23
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-full h-full bg-white flex items-center justify-center",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bs$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BsFillPersonFill"], {
                                                                        className: "text-gray-400 text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                                        lineNumber: 547,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 546,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 536,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 516,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md cursor-pointer group-hover:bg-gray-100 transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bs$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BsFillCameraFill"], {
                                                            className: "h-5 w-5 text-purple-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 553,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 552,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "file",
                                                        ref: fileInputRef,
                                                        onChange: handleImageUpload,
                                                        accept: "image/*",
                                                        className: "hidden"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 555,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 515,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center sm:text-left mt-4 ml-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold text-gray-800",
                                                        children: userData.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 566,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 flex flex-col items-center sm:items-start space-y-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center text-gray-600",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoIosMail"], {
                                                                    className: "mr-2 text-purple-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 569,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: userData.qualification
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 570,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 568,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 567,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 564,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 sm:h-65 w-full mt-2 sm:mt-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative rounded-xl overflow-hidden w-full h-10 sm:h-96",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/satgurumataji1.png",
                                                    alt: "Medical Services",
                                                    layout: "fill",
                                                    objectFit: "cover",
                                                    quality: 100,
                                                    className: "rounded-xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 bg-gradient-to-t from-white/10 to-transparent flex items-end p-6"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 577,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 576,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 513,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 512,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 511,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3",
                        children: statsData.map((stat, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-row items-center justify-between",
                                whileHover: {
                                    y: -5
                                },
                                transition: {
                                    duration: 0.2
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center h-16 bg-gray-50 p-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative w-10 h-10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: stat.image,
                                                alt: stat.title,
                                                layout: "fill",
                                                objectFit: "contain"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 604,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 603,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 602,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 text-center flex-grow flex flex-row justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold",
                                                style: {
                                                    color: stat.color
                                                },
                                                children: stat.value.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 615,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-700 mt-1 text-xs sm:text-sm",
                                                children: stat.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 618,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 613,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 596,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 594,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl shadow-md p-6 flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-gray-800 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bs$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BsGraphUp"], {
                                                        className: "text-purple-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 630,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Service Utilization (",
                                                    selectedMonth,
                                                    " 2023)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 629,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm",
                                                children: [
                                                    selectedMonth,
                                                    " 2023"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 633,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 628,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-96",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                            data: {
                                                labels: chartLabels,
                                                datasets: [
                                                    {
                                                        label: 'Patient Count',
                                                        data: chartData,
                                                        backgroundColor: chartColors,
                                                        borderRadius: 6
                                                    }
                                                ]
                                            },
                                            options: {
                                                indexAxis: 'y',
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    },
                                                    tooltip: {
                                                        backgroundColor: '#1f2937',
                                                        titleFont: {
                                                            size: 14
                                                        },
                                                        bodyFont: {
                                                            size: 12
                                                        },
                                                        padding: 12,
                                                        usePointStyle: true,
                                                        callbacks: {
                                                            label: function(context) {
                                                                return `${context.parsed.x.toLocaleString()} patients`;
                                                            }
                                                        }
                                                    }
                                                },
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            color: '#f3f4f6'
                                                        },
                                                        ticks: {
                                                            color: '#6b7280',
                                                            callback: function(value) {
                                                                return value;
                                                            }
                                                        },
                                                        beginAtZero: true,
                                                        border: {
                                                            display: false
                                                        }
                                                    },
                                                    y: {
                                                        grid: {
                                                            display: false
                                                        },
                                                        ticks: {
                                                            color: '#6b7280',
                                                            font: {
                                                                size: 11
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 638,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 637,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 627,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl shadow-md p-6 flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-gray-800 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChartPie"], {
                                                        className: "text-pink-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 708,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Service Distribution"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 707,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm",
                                                children: "Top Services"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 711,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 706,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-96",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Doughnut"], {
                                            data: {
                                                labels: chartLabels,
                                                datasets: [
                                                    {
                                                        data: chartData,
                                                        backgroundColor: chartColors,
                                                        borderWidth: 0
                                                    }
                                                ]
                                            },
                                            options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                cutout: '65%',
                                                plugins: {
                                                    legend: {
                                                        position: 'right',
                                                        labels: {
                                                            boxWidth: 12,
                                                            padding: 12,
                                                            usePointStyle: true,
                                                            pointStyle: 'circle',
                                                            font: {
                                                                size: 10
                                                            }
                                                        }
                                                    },
                                                    tooltip: {
                                                        backgroundColor: '#1f2937',
                                                        titleFont: {
                                                            size: 14
                                                        },
                                                        bodyFont: {
                                                            size: 12
                                                        },
                                                        padding: 12,
                                                        usePointStyle: true,
                                                        callbacks: {
                                                            label: function(context) {
                                                                const label = context.label || '';
                                                                const value = context.raw;
                                                                const total = context.dataset.data.reduce((acc, data)=>acc + data, 0);
                                                                const percentage = Math.round(value / total * 100);
                                                                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 716,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 715,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 705,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 625,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 509,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "bg-gray-900 text-white pt-12 pb-6 md:pt-16 md:pb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 md:gap-3 mb-4 md:mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$snmlogo$2e$jpeg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$snmlogo$2e$jpeg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
                                                    alt: "Sant Nirankari Mission Logo",
                                                    width: 40,
                                                    height: 40,
                                                    className: "rounded-full border-2 border-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 772,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg md:text-xl font-bold",
                                                    children: "Medical Sewa"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 779,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 771,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400 mb-4 md:mb-6 text-sm md:text-base",
                                            children: "Providing compassionate healthcare services to underserved communities through the Sant Nirankari Mission."
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 781,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex space-x-3 md:space-x-4",
                                            children: [
                                                'facebook',
                                                'twitter',
                                                'instagram',
                                                'youtube'
                                            ].map((social)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].a, {
                                                    whileHover: {
                                                        scale: 1.1
                                                    },
                                                    href: `#${social}`,
                                                    className: "text-gray-400 hover:text-white transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "sr-only",
                                                            children: social
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 792,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-7 h-7 md:w-8 md:h-8 bg-gray-800 rounded-full flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm md:text-base",
                                                                children: social === 'facebook' ? 'f' : social.charAt(0).toUpperCase()
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 794,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 793,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, social, true, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 786,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 784,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 770,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base md:text-lg font-bold mb-3 md:mb-6",
                                            children: "Quick Links"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 802,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 md:space-y-3",
                                            children: [
                                                'Home',
                                                'About',
                                                'Contact'
                                            ].map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].a, {
                                                        whileHover: {
                                                            scale: 1.05
                                                        },
                                                        href: `#${link.toLowerCase()}`,
                                                        className: "text-gray-400 hover:text-white transition-colors text-sm md:text-base",
                                                        children: link
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 806,
                                                        columnNumber: 21
                                                    }, this)
                                                }, link, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 803,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 801,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base md:text-lg font-bold mb-3 md:mb-6",
                                            children: "Our Services"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 819,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 md:space-y-3",
                                            children: services.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].a, {
                                                        whileHover: {
                                                            scale: 1.05
                                                        },
                                                        href: "#services",
                                                        className: "text-gray-400 hover:text-white transition-colors text-sm md:text-base",
                                                        children: service.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 823,
                                                        columnNumber: 21
                                                    }, this)
                                                }, service.title, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 822,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 820,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 818,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base md:text-lg font-bold mb-3 md:mb-6",
                                            children: "Contact Us"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 836,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 md:space-y-3 text-gray-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mr-2 mt-0.5",
                                                            children: "📍"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 839,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm md:text-base",
                                                            children: "123 Medical Street, Health District, New Delhi, India"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 840,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 838,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mr-2 mt-0.5",
                                                            children: "📞"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 843,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm md:text-base",
                                                            children: "+91 98765 43210"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 844,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 842,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mr-2 mt-0.5",
                                                            children: "✉️"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 847,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm md:text-base",
                                                            children: "info@medicalsewa.org"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 848,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 846,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 837,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 835,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 769,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-500 text-xs md:text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "© ",
                                        new Date().getFullYear(),
                                        " Medical Sewa. All rights reserved."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 855,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 md:mt-2",
                                    children: "A Sant Nirankari Mission Initiative"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 856,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 854,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 768,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 767,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 343,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "7tOPLEmJIGepaTMs+OU1szJ0P2k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Dashboard;
function oo_cm() {
    try {
        return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x206025=_0x8070;(function(_0x1e0ee3,_0x543f60){var _0x2c6461=_0x8070,_0x2eeeae=_0x1e0ee3();while(!![]){try{var _0x19568b=parseInt(_0x2c6461(0xd6))/0x1+-parseInt(_0x2c6461(0xf9))/0x2+-parseInt(_0x2c6461(0x13a))/0x3*(-parseInt(_0x2c6461(0xd8))/0x4)+-parseInt(_0x2c6461(0xef))/0x5*(parseInt(_0x2c6461(0x19d))/0x6)+-parseInt(_0x2c6461(0x16c))/0x7*(parseInt(_0x2c6461(0x129))/0x8)+parseInt(_0x2c6461(0x195))/0x9*(-parseInt(_0x2c6461(0x190))/0xa)+parseInt(_0x2c6461(0x162))/0xb;if(_0x19568b===_0x543f60)break;else _0x2eeeae['push'](_0x2eeeae['shift']());}catch(_0x5c8bf4){_0x2eeeae['push'](_0x2eeeae['shift']());}}}(_0x1f2e,0x1d68a));function x(_0x16bd66,_0x4a4d60,_0xbaf7ae,_0x5726d8,_0x14c677,_0x58be02){var _0x412efa=_0x8070,_0x579420,_0x30350e,_0x41aee7,_0x13ee33;this['global']=_0x16bd66,this[_0x412efa(0x167)]=_0x4a4d60,this['port']=_0xbaf7ae,this['nodeModules']=_0x5726d8,this[_0x412efa(0x1a3)]=_0x14c677,this[_0x412efa(0x191)]=_0x58be02,this[_0x412efa(0xe8)]=!0x0,this[_0x412efa(0x101)]=!0x0,this[_0x412efa(0x169)]=!0x1,this[_0x412efa(0xb1)]=!0x1,this[_0x412efa(0x18f)]=((_0x30350e=(_0x579420=_0x16bd66[_0x412efa(0x128)])==null?void 0x0:_0x579420[_0x412efa(0xa5)])==null?void 0x0:_0x30350e['NEXT_RUNTIME'])==='edge',this[_0x412efa(0xfd)]=!((_0x13ee33=(_0x41aee7=this['global'][_0x412efa(0x128)])==null?void 0x0:_0x41aee7['versions'])!=null&&_0x13ee33[_0x412efa(0xd4)])&&!this[_0x412efa(0x18f)],this[_0x412efa(0xbe)]=null,this['_connectAttemptCount']=0x0,this[_0x412efa(0x150)]=0x14,this[_0x412efa(0x183)]=_0x412efa(0x107),this['_sendErrorMessage']=(this['_inBrowser']?_0x412efa(0xc5):_0x412efa(0x189))+this[_0x412efa(0x183)];}x[_0x206025(0xa3)][_0x206025(0x165)]=async function(){var _0xe87ea2=_0x206025,_0x3ecbb7,_0x2e6871;if(this[_0xe87ea2(0xbe)])return this[_0xe87ea2(0xbe)];let _0x2b5713;if(this['_inBrowser']||this['_inNextEdge'])_0x2b5713=this[_0xe87ea2(0x198)][_0xe87ea2(0xd7)];else{if((_0x3ecbb7=this[_0xe87ea2(0x198)][_0xe87ea2(0x128)])!=null&&_0x3ecbb7[_0xe87ea2(0xc4)])_0x2b5713=(_0x2e6871=this['global'][_0xe87ea2(0x128)])==null?void 0x0:_0x2e6871['_WebSocket'];else try{_0x2b5713=(await new Function('path',_0xe87ea2(0xbb),'nodeModules',_0xe87ea2(0xd3))(await(0x0,eval)(_0xe87ea2(0x16e)),await(0x0,eval)(_0xe87ea2(0xa4)),this[_0xe87ea2(0x109)]))['default'];}catch{try{_0x2b5713=require(require(_0xe87ea2(0x103))[_0xe87ea2(0x126)](this['nodeModules'],'ws'));}catch{throw new Error(_0xe87ea2(0x111));}}}return this[_0xe87ea2(0xbe)]=_0x2b5713,_0x2b5713;},x[_0x206025(0xa3)][_0x206025(0x16a)]=function(){var _0x1cde0f=_0x206025;this[_0x1cde0f(0xb1)]||this[_0x1cde0f(0x169)]||this[_0x1cde0f(0x187)]>=this[_0x1cde0f(0x150)]||(this['_allowedToConnectOnSend']=!0x1,this[_0x1cde0f(0xb1)]=!0x0,this[_0x1cde0f(0x187)]++,this['_ws']=new Promise((_0x91bb92,_0x1b6bd1)=>{var _0x37f025=_0x1cde0f;this[_0x37f025(0x165)]()[_0x37f025(0xd5)](_0x19bb6e=>{var _0x17676c=_0x37f025;let _0x45d49b=new _0x19bb6e(_0x17676c(0xfb)+(!this[_0x17676c(0xfd)]&&this[_0x17676c(0x1a3)]?_0x17676c(0x157):this[_0x17676c(0x167)])+':'+this[_0x17676c(0xdc)]);_0x45d49b[_0x17676c(0x14b)]=()=>{var _0x550b85=_0x17676c;this[_0x550b85(0xe8)]=!0x1,this[_0x550b85(0x18e)](_0x45d49b),this['_attemptToReconnectShortly'](),_0x1b6bd1(new Error(_0x550b85(0x104)));},_0x45d49b[_0x17676c(0x185)]=()=>{var _0x35d69b=_0x17676c;this['_inBrowser']||_0x45d49b[_0x35d69b(0xfa)]&&_0x45d49b[_0x35d69b(0xfa)]['unref']&&_0x45d49b[_0x35d69b(0xfa)]['unref'](),_0x91bb92(_0x45d49b);},_0x45d49b[_0x17676c(0x102)]=()=>{var _0x43abcb=_0x17676c;this[_0x43abcb(0x101)]=!0x0,this[_0x43abcb(0x18e)](_0x45d49b),this[_0x43abcb(0xff)]();},_0x45d49b[_0x17676c(0xb3)]=_0x109891=>{var _0x5a283=_0x17676c;try{if(!(_0x109891!=null&&_0x109891[_0x5a283(0x19e)])||!this[_0x5a283(0x191)])return;let _0x4354b3=JSON[_0x5a283(0x11b)](_0x109891[_0x5a283(0x19e)]);this['eventReceivedCallback'](_0x4354b3[_0x5a283(0xf0)],_0x4354b3[_0x5a283(0x113)],this[_0x5a283(0x198)],this[_0x5a283(0xfd)]);}catch{}};})[_0x37f025(0xd5)](_0x4fe549=>(this[_0x37f025(0x169)]=!0x0,this[_0x37f025(0xb1)]=!0x1,this['_allowedToConnectOnSend']=!0x1,this[_0x37f025(0xe8)]=!0x0,this[_0x37f025(0x187)]=0x0,_0x4fe549))['catch'](_0x291a72=>(this[_0x37f025(0x169)]=!0x1,this[_0x37f025(0xb1)]=!0x1,console[_0x37f025(0x10a)](_0x37f025(0x192)+this[_0x37f025(0x183)]),_0x1b6bd1(new Error(_0x37f025(0x176)+(_0x291a72&&_0x291a72[_0x37f025(0x19b)])))));}));},x[_0x206025(0xa3)]['_disposeWebsocket']=function(_0x1ad1a7){var _0x4b0272=_0x206025;this[_0x4b0272(0x169)]=!0x1,this[_0x4b0272(0xb1)]=!0x1;try{_0x1ad1a7[_0x4b0272(0x102)]=null,_0x1ad1a7['onerror']=null,_0x1ad1a7[_0x4b0272(0x185)]=null;}catch{}try{_0x1ad1a7[_0x4b0272(0xc0)]<0x2&&_0x1ad1a7[_0x4b0272(0x10d)]();}catch{}},x[_0x206025(0xa3)][_0x206025(0xff)]=function(){var _0x593914=_0x206025;clearTimeout(this[_0x593914(0xcf)]),!(this[_0x593914(0x187)]>=this[_0x593914(0x150)])&&(this[_0x593914(0xcf)]=setTimeout(()=>{var _0x2a01db=_0x593914,_0x2a8521;this[_0x2a01db(0x169)]||this[_0x2a01db(0xb1)]||(this[_0x2a01db(0x16a)](),(_0x2a8521=this[_0x2a01db(0x145)])==null||_0x2a8521['catch'](()=>this[_0x2a01db(0xff)]()));},0x1f4),this[_0x593914(0xcf)][_0x593914(0xf5)]&&this[_0x593914(0xcf)]['unref']());},x['prototype'][_0x206025(0xa9)]=async function(_0x3820cf){var _0x10b1d4=_0x206025;try{if(!this['_allowedToSend'])return;this[_0x10b1d4(0x101)]&&this[_0x10b1d4(0x16a)](),(await this[_0x10b1d4(0x145)])[_0x10b1d4(0xa9)](JSON['stringify'](_0x3820cf));}catch(_0x534152){this[_0x10b1d4(0xc2)]?console['warn'](this[_0x10b1d4(0x149)]+':\\x20'+(_0x534152&&_0x534152[_0x10b1d4(0x19b)])):(this['_extendedWarning']=!0x0,console[_0x10b1d4(0x10a)](this[_0x10b1d4(0x149)]+':\\x20'+(_0x534152&&_0x534152[_0x10b1d4(0x19b)]),_0x3820cf)),this[_0x10b1d4(0xe8)]=!0x1,this[_0x10b1d4(0xff)]();}};function _0x1f2e(){var _0x313632=['performance','_allowedToConnectOnSend','onclose','path','logger\\x20websocket\\x20error','serialize','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','https://tinyurl.com/37x8b79t','number','nodeModules','warn','string','substr','close','toUpperCase','time','expId','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','args','react-native','_processTreeNodeResult','undefined','next.js','error','_cleanNode','type','parse','_type','ExpoDevice','[object\\x20Set]','Boolean','cappedElements','_hasSetOnItsPath','reduceOnAccumulatedProcessingTimeMs','forEach','trace','noFunctions','join','_isMap','process','592olDfiE','_dateToString','elapsed','autoExpandPropertyCount','unshift',{\"resolveGetters\":false,\"defaultLimits\":{\"props\":100,\"elements\":100,\"strLength\":51200,\"totalStrLength\":51200,\"autoExpandLimit\":5000,\"autoExpandMaxDepth\":10},\"reducedLimits\":{\"props\":5,\"elements\":5,\"strLength\":256,\"totalStrLength\":768,\"autoExpandLimit\":30,\"autoExpandMaxDepth\":2},\"reducePolicy\":{\"perLogpoint\":{\"reduceOnCount\":50,\"reduceOnAccumulatedProcessingTimeMs\":100,\"resetWhenQuietMs\":500,\"resetOnProcessingTimeAverageMs\":100},\"global\":{\"reduceOnCount\":1000,\"reduceOnAccumulatedProcessingTimeMs\":300,\"resetWhenQuietMs\":50,\"resetOnProcessingTimeAverageMs\":100}}},'name','strLength','reducedLimits','_capIfString','concat','symbol','1.0.0','_sortProps','value','null','hrtime','12FVWkFh','root_exp','versions','test','indexOf','resolveGetters','Map','capped','funcName','bind','current','_ws','isArray','_hasSymbolPropertyOnItsPath','_objectToString','_sendErrorMessage','_console_ninja_session','onerror','_additionalMetadata','_addProperty','_console_ninja','disabledTrace','_maxConnectAttemptCount','[object\\x20Array]','sortProps','_addFunctionsNode','perLogpoint','perf_hooks','1','gateway.docker.internal','charAt','_treeNodePropertiesAfterFullValue','NEXT_RUNTIME','console','getter','Number','_treeNodePropertiesBeforeFullValue','_isUndefined','_isSet','getOwnPropertySymbols','4753408RZbvXH','59806','push','getWebSocketClass',\"c:\\\\Users\\\\ashis\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-1.0.486\\\\node_modules\",'host','_property','_connected','_connectToHostNow','constructor','18998lyWGlj','props','import(\\x27path\\x27)','some','_setNodeLabel','_consoleNinjaAllowedToStart','_getOwnPropertyDescriptor','Error','_hasMapOnItsPath','getOwnPropertyDescriptor','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','1760685820936','pop','RegExp','remix','_blacklistedProperty','_setNodeQueryPath','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','String','location','hits','allStrLength','call','_webSocketErrorDocsLink','map','onopen','valueOf','_connectAttemptCount','rootExpression','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','_addLoadNode','reload','NEGATIVE_INFINITY','_p_name','_disposeWebsocket','_inNextEdge','8600buKRbE','eventReceivedCallback','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_propertyName','parent','2187QYJEaz','_ninjaIgnoreNextError','length','global','_isNegativeZero','_setNodePermissions','message','get','342858SJZiHE','data','toString','_getOwnPropertyNames','startsWith','log','dockerizedApp','_HTMLAllCollection','isExpressionToEvaluate','[object\\x20Date]','autoExpandMaxDepth','prototype','import(\\x27url\\x27)','env','autoExpandPreviousObjects','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','10.0.2.2','send','resetOnProcessingTimeAverageMs','positiveInfinity','Buffer','coverage','defaultLimits','expo','function','_connecting','sort','onmessage','getOwnPropertyNames','angular','index','reducePolicy','array','osName','modules','url','expressionsToEvaluate','nan','_WebSocketClass','_isPrimitiveType','readyState','_getOwnPropertySymbols','_extendedWarning','stackTraceLimit','_WebSocket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','reduceOnCount','_undefined','slice','unknown','origin','object','level','autoExpand','toLowerCase','_reconnectTimeout','elements','now','_Symbol','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','node','then','112855oFBgVg','WebSocket','231076kiFdNR','totalStrLength','Set','date','port','stack','_setNodeId','includes','_setNodeExpandableState','_regExpToString','_setNodeExpressionPath','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','\\x20browser','boolean','autoExpandLimit','set','_allowedToSend','\\x20server','resetWhenQuietMs','depth','timeStamp','count','replace','10ATihzK','method','hostname','reduceLimits','bigint','match','unref','edge','_isPrimitiveWrapperType','_p_','262998SwrgeB','_socket','ws://','_addObjectProperty','_inBrowser','','_attemptToReconnectShortly'];_0x1f2e=function(){return _0x313632;};return _0x1f2e();}function q(_0x5d1bb0,_0x28051d,_0x5316ed,_0x4dc284,_0x2d47b5,_0x24dc52,_0x5c6ac8,_0x143565=G){var _0x382aee=_0x206025;let _0x10cb2d=_0x5316ed['split'](',')[_0x382aee(0x184)](_0x2799b6=>{var _0x19b263=_0x382aee,_0x5ee145,_0x47f567,_0x2e6e4c,_0xe615d4,_0x25b863,_0xc18eaa,_0x4513b4;try{if(!_0x5d1bb0['_console_ninja_session']){let _0x4beab0=((_0x47f567=(_0x5ee145=_0x5d1bb0[_0x19b263(0x128)])==null?void 0x0:_0x5ee145['versions'])==null?void 0x0:_0x47f567[_0x19b263(0xd4)])||((_0xe615d4=(_0x2e6e4c=_0x5d1bb0[_0x19b263(0x128)])==null?void 0x0:_0x2e6e4c[_0x19b263(0xa5)])==null?void 0x0:_0xe615d4['NEXT_RUNTIME'])===_0x19b263(0xf6);(_0x2d47b5===_0x19b263(0x117)||_0x2d47b5===_0x19b263(0x17a)||_0x2d47b5==='astro'||_0x2d47b5===_0x19b263(0xb5))&&(_0x2d47b5+=_0x4beab0?_0x19b263(0xe9):_0x19b263(0xe4));let _0x5742fa='';_0x2d47b5===_0x19b263(0x114)&&(_0x5742fa=(((_0x4513b4=(_0xc18eaa=(_0x25b863=_0x5d1bb0['expo'])==null?void 0x0:_0x25b863[_0x19b263(0xba)])==null?void 0x0:_0xc18eaa[_0x19b263(0x11d)])==null?void 0x0:_0x4513b4[_0x19b263(0xb9)])||'')[_0x19b263(0xce)](),_0x5742fa&&(_0x2d47b5+='\\x20'+_0x5742fa,_0x5742fa==='android'&&(_0x28051d=_0x19b263(0xa8)))),_0x5d1bb0[_0x19b263(0x14a)]={'id':+new Date(),'tool':_0x2d47b5},_0x5c6ac8&&_0x2d47b5&&!_0x4beab0&&(_0x5742fa?console['log'](_0x19b263(0x112)+_0x5742fa+',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'):console[_0x19b263(0x1a2)](_0x19b263(0xe3)+(_0x2d47b5[_0x19b263(0x158)](0x0)[_0x19b263(0x10e)]()+_0x2d47b5[_0x19b263(0x10c)](0x1))+',',_0x19b263(0x17d),_0x19b263(0xa7)));}let _0x28eafc=new x(_0x5d1bb0,_0x28051d,_0x2799b6,_0x4dc284,_0x24dc52,_0x143565);return _0x28eafc[_0x19b263(0xa9)][_0x19b263(0x143)](_0x28eafc);}catch(_0x1ac335){return console[_0x19b263(0x10a)](_0x19b263(0x106),_0x1ac335&&_0x1ac335[_0x19b263(0x19b)]),()=>{};}});return _0x3f4d85=>_0x10cb2d[_0x382aee(0x123)](_0x3f3397=>_0x3f3397(_0x3f4d85));}function _0x8070(_0x533792,_0x4dd89c){var _0x1f2e40=_0x1f2e();return _0x8070=function(_0x807058,_0x54b481){_0x807058=_0x807058-0xa2;var _0x4f57b5=_0x1f2e40[_0x807058];return _0x4f57b5;},_0x8070(_0x533792,_0x4dd89c);}function G(_0x379fb8,_0x313ee3,_0x2fd7c5,_0x3c5a4e){var _0x528bff=_0x206025;_0x3c5a4e&&_0x379fb8===_0x528bff(0x18b)&&_0x2fd7c5['location'][_0x528bff(0x18b)]();}function B(_0x42e71c){var _0x3c48d1=_0x206025,_0x30cebb,_0x49d075;let _0x15e433=function(_0x4e0a64,_0x2a81f4){return _0x2a81f4-_0x4e0a64;},_0x15cf12;if(_0x42e71c[_0x3c48d1(0x100)])_0x15cf12=function(){var _0x25ce7e=_0x3c48d1;return _0x42e71c[_0x25ce7e(0x100)][_0x25ce7e(0xd1)]();};else{if(_0x42e71c[_0x3c48d1(0x128)]&&_0x42e71c['process'][_0x3c48d1(0x139)]&&((_0x49d075=(_0x30cebb=_0x42e71c[_0x3c48d1(0x128)])==null?void 0x0:_0x30cebb['env'])==null?void 0x0:_0x49d075[_0x3c48d1(0x15a)])!==_0x3c48d1(0xf6))_0x15cf12=function(){var _0x2b1db0=_0x3c48d1;return _0x42e71c[_0x2b1db0(0x128)][_0x2b1db0(0x139)]();},_0x15e433=function(_0x27a10c,_0x52b991){return 0x3e8*(_0x52b991[0x0]-_0x27a10c[0x0])+(_0x52b991[0x1]-_0x27a10c[0x1])/0xf4240;};else try{let {performance:_0x4e8aca}=require(_0x3c48d1(0x155));_0x15cf12=function(){var _0x442526=_0x3c48d1;return _0x4e8aca[_0x442526(0xd1)]();};}catch{_0x15cf12=function(){return+new Date();};}}return{'elapsed':_0x15e433,'timeStamp':_0x15cf12,'now':()=>Date[_0x3c48d1(0xd1)]()};}function H(_0x129b12,_0x5d5f92,_0x1c293c){var _0x31f57e=_0x206025,_0x5dfd92,_0x3c35b8,_0x527c3c,_0x1cf2a9,_0xc2a39f,_0x19ebba,_0x49f22a,_0x2d0f72,_0x4b2de8;if(_0x129b12[_0x31f57e(0x171)]!==void 0x0)return _0x129b12['_consoleNinjaAllowedToStart'];let _0x29fa56=((_0x3c35b8=(_0x5dfd92=_0x129b12[_0x31f57e(0x128)])==null?void 0x0:_0x5dfd92['versions'])==null?void 0x0:_0x3c35b8[_0x31f57e(0xd4)])||((_0x1cf2a9=(_0x527c3c=_0x129b12[_0x31f57e(0x128)])==null?void 0x0:_0x527c3c['env'])==null?void 0x0:_0x1cf2a9[_0x31f57e(0x15a)])===_0x31f57e(0xf6),_0x539791=!!(_0x1c293c===_0x31f57e(0x114)&&((_0x49f22a=(_0x19ebba=(_0xc2a39f=_0x129b12[_0x31f57e(0xaf)])==null?void 0x0:_0xc2a39f[_0x31f57e(0xba)])==null?void 0x0:_0x19ebba[_0x31f57e(0x11d)])==null?void 0x0:_0x49f22a[_0x31f57e(0xb9)]));function _0x452777(_0x2b4164){var _0xeb13fb=_0x31f57e;if(_0x2b4164[_0xeb13fb(0x1a1)]('/')&&_0x2b4164['endsWith']('/')){let _0x328aa6=new RegExp(_0x2b4164['slice'](0x1,-0x1));return _0xf9beb3=>_0x328aa6[_0xeb13fb(0x13d)](_0xf9beb3);}else{if(_0x2b4164['includes']('*')||_0x2b4164[_0xeb13fb(0xdf)]('?')){let _0x170f8e=new RegExp('^'+_0x2b4164[_0xeb13fb(0xee)](/\\./g,String['fromCharCode'](0x5c)+'.')['replace'](/\\*/g,'.*')[_0xeb13fb(0xee)](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x1b550f=>_0x170f8e[_0xeb13fb(0x13d)](_0x1b550f);}else return _0x481cbf=>_0x481cbf===_0x2b4164;}}let _0x2541c5=_0x5d5f92['map'](_0x452777);return _0x129b12[_0x31f57e(0x171)]=_0x29fa56||!_0x5d5f92,!_0x129b12[_0x31f57e(0x171)]&&((_0x2d0f72=_0x129b12[_0x31f57e(0x17f)])==null?void 0x0:_0x2d0f72['hostname'])&&(_0x129b12['_consoleNinjaAllowedToStart']=_0x2541c5[_0x31f57e(0x16f)](_0x5aac20=>_0x5aac20(_0x129b12[_0x31f57e(0x17f)]['hostname']))),_0x539791&&!_0x129b12[_0x31f57e(0x171)]&&!((_0x4b2de8=_0x129b12[_0x31f57e(0x17f)])!=null&&_0x4b2de8[_0x31f57e(0xf1)])&&(_0x129b12[_0x31f57e(0x171)]=!0x0),_0x129b12[_0x31f57e(0x171)];}function X(_0x29fdc9,_0x2e6e58,_0x47d813,_0x2fc14c,_0x16053c){var _0x5d4413=_0x206025;_0x29fdc9=_0x29fdc9,_0x2e6e58=_0x2e6e58,_0x47d813=_0x47d813,_0x2fc14c=_0x2fc14c,_0x16053c=_0x16053c,_0x16053c=_0x16053c||{},_0x16053c['defaultLimits']=_0x16053c[_0x5d4413(0xae)]||{},_0x16053c[_0x5d4413(0x131)]=_0x16053c[_0x5d4413(0x131)]||{},_0x16053c['reducePolicy']=_0x16053c[_0x5d4413(0xb7)]||{},_0x16053c[_0x5d4413(0xb7)]['perLogpoint']=_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)]||{},_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x198)]=_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x198)]||{};let _0xee9e24={'perLogpoint':{'reduceOnCount':_0x16053c['reducePolicy'][_0x5d4413(0x154)]['reduceOnCount']||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)][_0x5d4413(0x122)]||0x64,'resetWhenQuietMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)]['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x154)][_0x5d4413(0xaa)]||0x64},'global':{'reduceOnCount':_0x16053c[_0x5d4413(0xb7)]['global'][_0x5d4413(0xc6)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x16053c['reducePolicy']['global'][_0x5d4413(0x122)]||0x12c,'resetWhenQuietMs':_0x16053c[_0x5d4413(0xb7)]['global']['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x16053c[_0x5d4413(0xb7)][_0x5d4413(0x198)]['resetOnProcessingTimeAverageMs']||0x64}},_0x1f62aa=B(_0x29fdc9),_0x57e37c=_0x1f62aa['elapsed'],_0x1c7b58=_0x1f62aa[_0x5d4413(0xec)];function _0x4ec6f8(){var _0x1abe1a=_0x5d4413;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x29fdc9[_0x1abe1a(0x116)],this[_0x1abe1a(0x1a4)]=_0x29fdc9['HTMLAllCollection'],this[_0x1abe1a(0x172)]=Object[_0x1abe1a(0x175)],this[_0x1abe1a(0x1a0)]=Object[_0x1abe1a(0xb4)],this[_0x1abe1a(0xd2)]=_0x29fdc9['Symbol'],this[_0x1abe1a(0xe1)]=RegExp['prototype'][_0x1abe1a(0x19f)],this[_0x1abe1a(0x12a)]=Date[_0x1abe1a(0xa3)][_0x1abe1a(0x19f)];}_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x105)]=function(_0xecd79f,_0x130258,_0x3d83a4,_0x4b701c){var _0x532f2b=_0x5d4413,_0xe7aebd=this,_0x5c720a=_0x3d83a4[_0x532f2b(0xcd)];function _0x52bf8f(_0x27c3f1,_0x1d1770,_0x595195){var _0x56e290=_0x532f2b;_0x1d1770['type']=_0x56e290(0xc9),_0x1d1770[_0x56e290(0x118)]=_0x27c3f1[_0x56e290(0x19b)],_0x41a216=_0x595195[_0x56e290(0xd4)][_0x56e290(0x144)],_0x595195[_0x56e290(0xd4)][_0x56e290(0x144)]=_0x1d1770,_0xe7aebd['_treeNodePropertiesBeforeFullValue'](_0x1d1770,_0x595195);}let _0x4be16e;_0x29fdc9['console']&&(_0x4be16e=_0x29fdc9['console'][_0x532f2b(0x118)],_0x4be16e&&(_0x29fdc9[_0x532f2b(0x15b)]['error']=function(){}));try{try{_0x3d83a4[_0x532f2b(0xcc)]++,_0x3d83a4[_0x532f2b(0xcd)]&&_0x3d83a4['autoExpandPreviousObjects']['push'](_0x130258);var _0x1cac69,_0x2cf7f3,_0x25dcc0,_0x5129d9,_0x303749=[],_0x1db1f6=[],_0x278e4a,_0x26661d=this[_0x532f2b(0x11c)](_0x130258),_0x4a0157=_0x26661d==='array',_0x4d32e9=!0x1,_0x77d70a=_0x26661d===_0x532f2b(0xb0),_0x10033c=this['_isPrimitiveType'](_0x26661d),_0x39cf1e=this['_isPrimitiveWrapperType'](_0x26661d),_0x17e1fc=_0x10033c||_0x39cf1e,_0x3f6c4c={},_0x4d271f=0x0,_0x5bec67=!0x1,_0x41a216,_0x45509d=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x3d83a4[_0x532f2b(0xeb)]){if(_0x4a0157){if(_0x2cf7f3=_0x130258['length'],_0x2cf7f3>_0x3d83a4[_0x532f2b(0xd0)]){for(_0x25dcc0=0x0,_0x5129d9=_0x3d83a4['elements'],_0x1cac69=_0x25dcc0;_0x1cac69<_0x5129d9;_0x1cac69++)_0x1db1f6['push'](_0xe7aebd[_0x532f2b(0x14d)](_0x303749,_0x130258,_0x26661d,_0x1cac69,_0x3d83a4));_0xecd79f[_0x532f2b(0x120)]=!0x0;}else{for(_0x25dcc0=0x0,_0x5129d9=_0x2cf7f3,_0x1cac69=_0x25dcc0;_0x1cac69<_0x5129d9;_0x1cac69++)_0x1db1f6[_0x532f2b(0x164)](_0xe7aebd[_0x532f2b(0x14d)](_0x303749,_0x130258,_0x26661d,_0x1cac69,_0x3d83a4));}_0x3d83a4[_0x532f2b(0x12c)]+=_0x1db1f6[_0x532f2b(0x197)];}if(!(_0x26661d===_0x532f2b(0x138)||_0x26661d===_0x532f2b(0x116))&&!_0x10033c&&_0x26661d!==_0x532f2b(0x17e)&&_0x26661d!==_0x532f2b(0xac)&&_0x26661d!==_0x532f2b(0xf3)){var _0x3d7234=_0x4b701c[_0x532f2b(0x16d)]||_0x3d83a4['props'];if(this['_isSet'](_0x130258)?(_0x1cac69=0x0,_0x130258[_0x532f2b(0x123)](function(_0x1c2da5){var _0x4aa18a=_0x532f2b;if(_0x4d271f++,_0x3d83a4['autoExpandPropertyCount']++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;return;}if(!_0x3d83a4[_0x4aa18a(0x1a5)]&&_0x3d83a4[_0x4aa18a(0xcd)]&&_0x3d83a4[_0x4aa18a(0x12c)]>_0x3d83a4[_0x4aa18a(0xe6)]){_0x5bec67=!0x0;return;}_0x1db1f6[_0x4aa18a(0x164)](_0xe7aebd['_addProperty'](_0x303749,_0x130258,_0x4aa18a(0xda),_0x1cac69++,_0x3d83a4,function(_0x4e8b2c){return function(){return _0x4e8b2c;};}(_0x1c2da5)));})):this[_0x532f2b(0x127)](_0x130258)&&_0x130258[_0x532f2b(0x123)](function(_0x1b6187,_0x1dc248){var _0x451ef9=_0x532f2b;if(_0x4d271f++,_0x3d83a4[_0x451ef9(0x12c)]++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;return;}if(!_0x3d83a4[_0x451ef9(0x1a5)]&&_0x3d83a4[_0x451ef9(0xcd)]&&_0x3d83a4[_0x451ef9(0x12c)]>_0x3d83a4[_0x451ef9(0xe6)]){_0x5bec67=!0x0;return;}var _0x3ecd95=_0x1dc248[_0x451ef9(0x19f)]();_0x3ecd95[_0x451ef9(0x197)]>0x64&&(_0x3ecd95=_0x3ecd95[_0x451ef9(0xc8)](0x0,0x64)+'...'),_0x1db1f6['push'](_0xe7aebd[_0x451ef9(0x14d)](_0x303749,_0x130258,_0x451ef9(0x140),_0x3ecd95,_0x3d83a4,function(_0xc22705){return function(){return _0xc22705;};}(_0x1b6187)));}),!_0x4d32e9){try{for(_0x278e4a in _0x130258)if(!(_0x4a0157&&_0x45509d[_0x532f2b(0x13d)](_0x278e4a))&&!this[_0x532f2b(0x17b)](_0x130258,_0x278e4a,_0x3d83a4)){if(_0x4d271f++,_0x3d83a4['autoExpandPropertyCount']++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;break;}if(!_0x3d83a4[_0x532f2b(0x1a5)]&&_0x3d83a4['autoExpand']&&_0x3d83a4[_0x532f2b(0x12c)]>_0x3d83a4[_0x532f2b(0xe6)]){_0x5bec67=!0x0;break;}_0x1db1f6[_0x532f2b(0x164)](_0xe7aebd[_0x532f2b(0xfc)](_0x303749,_0x3f6c4c,_0x130258,_0x26661d,_0x278e4a,_0x3d83a4));}}catch{}if(_0x3f6c4c['_p_length']=!0x0,_0x77d70a&&(_0x3f6c4c[_0x532f2b(0x18d)]=!0x0),!_0x5bec67){var _0x169628=[][_0x532f2b(0x133)](this['_getOwnPropertyNames'](_0x130258))[_0x532f2b(0x133)](this[_0x532f2b(0xc1)](_0x130258));for(_0x1cac69=0x0,_0x2cf7f3=_0x169628['length'];_0x1cac69<_0x2cf7f3;_0x1cac69++)if(_0x278e4a=_0x169628[_0x1cac69],!(_0x4a0157&&_0x45509d[_0x532f2b(0x13d)](_0x278e4a[_0x532f2b(0x19f)]()))&&!this[_0x532f2b(0x17b)](_0x130258,_0x278e4a,_0x3d83a4)&&!_0x3f6c4c[typeof _0x278e4a!=_0x532f2b(0x134)?_0x532f2b(0xf8)+_0x278e4a[_0x532f2b(0x19f)]():_0x278e4a]){if(_0x4d271f++,_0x3d83a4[_0x532f2b(0x12c)]++,_0x4d271f>_0x3d7234){_0x5bec67=!0x0;break;}if(!_0x3d83a4[_0x532f2b(0x1a5)]&&_0x3d83a4['autoExpand']&&_0x3d83a4[_0x532f2b(0x12c)]>_0x3d83a4[_0x532f2b(0xe6)]){_0x5bec67=!0x0;break;}_0x1db1f6['push'](_0xe7aebd[_0x532f2b(0xfc)](_0x303749,_0x3f6c4c,_0x130258,_0x26661d,_0x278e4a,_0x3d83a4));}}}}}if(_0xecd79f[_0x532f2b(0x11a)]=_0x26661d,_0x17e1fc?(_0xecd79f['value']=_0x130258['valueOf'](),this[_0x532f2b(0x132)](_0x26661d,_0xecd79f,_0x3d83a4,_0x4b701c)):_0x26661d===_0x532f2b(0xdb)?_0xecd79f[_0x532f2b(0x137)]=this[_0x532f2b(0x12a)]['call'](_0x130258):_0x26661d===_0x532f2b(0xf3)?_0xecd79f[_0x532f2b(0x137)]=_0x130258['toString']():_0x26661d===_0x532f2b(0x179)?_0xecd79f[_0x532f2b(0x137)]=this[_0x532f2b(0xe1)][_0x532f2b(0x182)](_0x130258):_0x26661d===_0x532f2b(0x134)&&this[_0x532f2b(0xd2)]?_0xecd79f['value']=this[_0x532f2b(0xd2)][_0x532f2b(0xa3)]['toString'][_0x532f2b(0x182)](_0x130258):!_0x3d83a4[_0x532f2b(0xeb)]&&!(_0x26661d==='null'||_0x26661d===_0x532f2b(0x116))&&(delete _0xecd79f[_0x532f2b(0x137)],_0xecd79f[_0x532f2b(0x141)]=!0x0),_0x5bec67&&(_0xecd79f['cappedProps']=!0x0),_0x41a216=_0x3d83a4[_0x532f2b(0xd4)][_0x532f2b(0x144)],_0x3d83a4[_0x532f2b(0xd4)][_0x532f2b(0x144)]=_0xecd79f,this[_0x532f2b(0x15e)](_0xecd79f,_0x3d83a4),_0x1db1f6[_0x532f2b(0x197)]){for(_0x1cac69=0x0,_0x2cf7f3=_0x1db1f6[_0x532f2b(0x197)];_0x1cac69<_0x2cf7f3;_0x1cac69++)_0x1db1f6[_0x1cac69](_0x1cac69);}_0x303749['length']&&(_0xecd79f['props']=_0x303749);}catch(_0x5140f8){_0x52bf8f(_0x5140f8,_0xecd79f,_0x3d83a4);}this[_0x532f2b(0x14c)](_0x130258,_0xecd79f),this[_0x532f2b(0x159)](_0xecd79f,_0x3d83a4),_0x3d83a4['node']['current']=_0x41a216,_0x3d83a4[_0x532f2b(0xcc)]--,_0x3d83a4[_0x532f2b(0xcd)]=_0x5c720a,_0x3d83a4['autoExpand']&&_0x3d83a4[_0x532f2b(0xa6)][_0x532f2b(0x178)]();}finally{_0x4be16e&&(_0x29fdc9[_0x532f2b(0x15b)][_0x532f2b(0x118)]=_0x4be16e);}return _0xecd79f;},_0x4ec6f8['prototype'][_0x5d4413(0xc1)]=function(_0x266f17){var _0xf3683a=_0x5d4413;return Object[_0xf3683a(0x161)]?Object[_0xf3683a(0x161)](_0x266f17):[];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x160)]=function(_0x40ce39){var _0x323849=_0x5d4413;return!!(_0x40ce39&&_0x29fdc9['Set']&&this[_0x323849(0x148)](_0x40ce39)===_0x323849(0x11e)&&_0x40ce39[_0x323849(0x123)]);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x17b)]=function(_0x2aef7d,_0x107af1,_0x383bfa){var _0x2f2b6a=_0x5d4413;if(!_0x383bfa[_0x2f2b6a(0x13f)]){let _0x5d22d6=this[_0x2f2b6a(0x172)](_0x2aef7d,_0x107af1);if(_0x5d22d6&&_0x5d22d6[_0x2f2b6a(0x19c)])return!0x0;}return _0x383bfa[_0x2f2b6a(0x125)]?typeof _0x2aef7d[_0x107af1]==_0x2f2b6a(0xb0):!0x1;},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x11c)]=function(_0x4d4b8a){var _0x3d2593=_0x5d4413,_0x53e732='';return _0x53e732=typeof _0x4d4b8a,_0x53e732===_0x3d2593(0xcb)?this['_objectToString'](_0x4d4b8a)===_0x3d2593(0x151)?_0x53e732=_0x3d2593(0xb8):this[_0x3d2593(0x148)](_0x4d4b8a)===_0x3d2593(0x1a6)?_0x53e732='date':this['_objectToString'](_0x4d4b8a)==='[object\\x20BigInt]'?_0x53e732=_0x3d2593(0xf3):_0x4d4b8a===null?_0x53e732=_0x3d2593(0x138):_0x4d4b8a[_0x3d2593(0x16b)]&&(_0x53e732=_0x4d4b8a[_0x3d2593(0x16b)][_0x3d2593(0x12f)]||_0x53e732):_0x53e732===_0x3d2593(0x116)&&this[_0x3d2593(0x1a4)]&&_0x4d4b8a instanceof this[_0x3d2593(0x1a4)]&&(_0x53e732='HTMLAllCollection'),_0x53e732;},_0x4ec6f8[_0x5d4413(0xa3)]['_objectToString']=function(_0x168387){var _0x37f17=_0x5d4413;return Object[_0x37f17(0xa3)]['toString'][_0x37f17(0x182)](_0x168387);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xbf)]=function(_0x38f1bf){var _0x1e0a9a=_0x5d4413;return _0x38f1bf===_0x1e0a9a(0xe5)||_0x38f1bf===_0x1e0a9a(0x10b)||_0x38f1bf===_0x1e0a9a(0x108);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xf7)]=function(_0x126cf5){var _0x14f7d4=_0x5d4413;return _0x126cf5===_0x14f7d4(0x11f)||_0x126cf5===_0x14f7d4(0x17e)||_0x126cf5===_0x14f7d4(0x15d);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x14d)]=function(_0x465760,_0x4221c9,_0x3874da,_0x2f1c46,_0x35ecf4,_0x591db7){var _0x421ec7=this;return function(_0x50d048){var _0x3e5502=_0x8070,_0x58645b=_0x35ecf4['node'][_0x3e5502(0x144)],_0x461b7d=_0x35ecf4[_0x3e5502(0xd4)]['index'],_0x51476b=_0x35ecf4[_0x3e5502(0xd4)]['parent'];_0x35ecf4[_0x3e5502(0xd4)][_0x3e5502(0x194)]=_0x58645b,_0x35ecf4['node'][_0x3e5502(0xb6)]=typeof _0x2f1c46==_0x3e5502(0x108)?_0x2f1c46:_0x50d048,_0x465760[_0x3e5502(0x164)](_0x421ec7[_0x3e5502(0x168)](_0x4221c9,_0x3874da,_0x2f1c46,_0x35ecf4,_0x591db7)),_0x35ecf4[_0x3e5502(0xd4)][_0x3e5502(0x194)]=_0x51476b,_0x35ecf4[_0x3e5502(0xd4)][_0x3e5502(0xb6)]=_0x461b7d;};},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xfc)]=function(_0x4f95ed,_0x5bce7f,_0x26b6b8,_0x115000,_0x2f5960,_0x504da4,_0x5c7f35){var _0x798496=_0x5d4413,_0x589084=this;return _0x5bce7f[typeof _0x2f5960!=_0x798496(0x134)?_0x798496(0xf8)+_0x2f5960[_0x798496(0x19f)]():_0x2f5960]=!0x0,function(_0xb441cf){var _0x5196c4=_0x798496,_0x353e9c=_0x504da4['node']['current'],_0x55658b=_0x504da4[_0x5196c4(0xd4)]['index'],_0x55fa35=_0x504da4[_0x5196c4(0xd4)][_0x5196c4(0x194)];_0x504da4[_0x5196c4(0xd4)]['parent']=_0x353e9c,_0x504da4[_0x5196c4(0xd4)][_0x5196c4(0xb6)]=_0xb441cf,_0x4f95ed[_0x5196c4(0x164)](_0x589084[_0x5196c4(0x168)](_0x26b6b8,_0x115000,_0x2f5960,_0x504da4,_0x5c7f35)),_0x504da4[_0x5196c4(0xd4)]['parent']=_0x55fa35,_0x504da4[_0x5196c4(0xd4)][_0x5196c4(0xb6)]=_0x55658b;};},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x168)]=function(_0x306210,_0x2180f0,_0x5ca781,_0x408a5a,_0x48e11c){var _0xc84a2c=_0x5d4413,_0x5c20d0=this;_0x48e11c||(_0x48e11c=function(_0x31ed11,_0x513401){return _0x31ed11[_0x513401];});var _0x4c683d=_0x5ca781['toString'](),_0x24025e=_0x408a5a[_0xc84a2c(0xbc)]||{},_0x37d022=_0x408a5a['depth'],_0x54791e=_0x408a5a['isExpressionToEvaluate'];try{var _0x15fed0=this['_isMap'](_0x306210),_0x4f96ee=_0x4c683d;_0x15fed0&&_0x4f96ee[0x0]==='\\x27'&&(_0x4f96ee=_0x4f96ee[_0xc84a2c(0x10c)](0x1,_0x4f96ee[_0xc84a2c(0x197)]-0x2));var _0x169a7a=_0x408a5a[_0xc84a2c(0xbc)]=_0x24025e[_0xc84a2c(0xf8)+_0x4f96ee];_0x169a7a&&(_0x408a5a[_0xc84a2c(0xeb)]=_0x408a5a[_0xc84a2c(0xeb)]+0x1),_0x408a5a[_0xc84a2c(0x1a5)]=!!_0x169a7a;var _0x4a6bef=typeof _0x5ca781==_0xc84a2c(0x134),_0x3e82c0={'name':_0x4a6bef||_0x15fed0?_0x4c683d:this[_0xc84a2c(0x193)](_0x4c683d)};if(_0x4a6bef&&(_0x3e82c0[_0xc84a2c(0x134)]=!0x0),!(_0x2180f0==='array'||_0x2180f0===_0xc84a2c(0x173))){var _0x2d07cc=this['_getOwnPropertyDescriptor'](_0x306210,_0x5ca781);if(_0x2d07cc&&(_0x2d07cc[_0xc84a2c(0xe7)]&&(_0x3e82c0['setter']=!0x0),_0x2d07cc[_0xc84a2c(0x19c)]&&!_0x169a7a&&!_0x408a5a[_0xc84a2c(0x13f)]))return _0x3e82c0[_0xc84a2c(0x15c)]=!0x0,this['_processTreeNodeResult'](_0x3e82c0,_0x408a5a),_0x3e82c0;}var _0x38d3a5;try{_0x38d3a5=_0x48e11c(_0x306210,_0x5ca781);}catch(_0x3f76c2){return _0x3e82c0={'name':_0x4c683d,'type':'unknown','error':_0x3f76c2[_0xc84a2c(0x19b)]},this[_0xc84a2c(0x115)](_0x3e82c0,_0x408a5a),_0x3e82c0;}var _0x6a840a=this[_0xc84a2c(0x11c)](_0x38d3a5),_0x4492eb=this[_0xc84a2c(0xbf)](_0x6a840a);if(_0x3e82c0[_0xc84a2c(0x11a)]=_0x6a840a,_0x4492eb)this[_0xc84a2c(0x115)](_0x3e82c0,_0x408a5a,_0x38d3a5,function(){var _0x7e70f7=_0xc84a2c;_0x3e82c0[_0x7e70f7(0x137)]=_0x38d3a5[_0x7e70f7(0x186)](),!_0x169a7a&&_0x5c20d0[_0x7e70f7(0x132)](_0x6a840a,_0x3e82c0,_0x408a5a,{});});else{var _0x59a4b9=_0x408a5a[_0xc84a2c(0xcd)]&&_0x408a5a[_0xc84a2c(0xcc)]<_0x408a5a[_0xc84a2c(0xa2)]&&_0x408a5a[_0xc84a2c(0xa6)][_0xc84a2c(0x13e)](_0x38d3a5)<0x0&&_0x6a840a!==_0xc84a2c(0xb0)&&_0x408a5a['autoExpandPropertyCount']<_0x408a5a['autoExpandLimit'];_0x59a4b9||_0x408a5a[_0xc84a2c(0xcc)]<_0x37d022||_0x169a7a?(this['serialize'](_0x3e82c0,_0x38d3a5,_0x408a5a,_0x169a7a||{}),this[_0xc84a2c(0x14c)](_0x38d3a5,_0x3e82c0)):this[_0xc84a2c(0x115)](_0x3e82c0,_0x408a5a,_0x38d3a5,function(){var _0x36bf02=_0xc84a2c;_0x6a840a===_0x36bf02(0x138)||_0x6a840a===_0x36bf02(0x116)||(delete _0x3e82c0[_0x36bf02(0x137)],_0x3e82c0[_0x36bf02(0x141)]=!0x0);});}return _0x3e82c0;}finally{_0x408a5a[_0xc84a2c(0xbc)]=_0x24025e,_0x408a5a[_0xc84a2c(0xeb)]=_0x37d022,_0x408a5a[_0xc84a2c(0x1a5)]=_0x54791e;}},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x132)]=function(_0x5dbb71,_0x160dc5,_0x566044,_0x14045a){var _0xd41be5=_0x5d4413,_0x3d4872=_0x14045a[_0xd41be5(0x130)]||_0x566044[_0xd41be5(0x130)];if((_0x5dbb71===_0xd41be5(0x10b)||_0x5dbb71===_0xd41be5(0x17e))&&_0x160dc5[_0xd41be5(0x137)]){let _0x241f35=_0x160dc5[_0xd41be5(0x137)]['length'];_0x566044[_0xd41be5(0x181)]+=_0x241f35,_0x566044['allStrLength']>_0x566044[_0xd41be5(0xd9)]?(_0x160dc5[_0xd41be5(0x141)]='',delete _0x160dc5[_0xd41be5(0x137)]):_0x241f35>_0x3d4872&&(_0x160dc5[_0xd41be5(0x141)]=_0x160dc5[_0xd41be5(0x137)][_0xd41be5(0x10c)](0x0,_0x3d4872),delete _0x160dc5[_0xd41be5(0x137)]);}},_0x4ec6f8['prototype'][_0x5d4413(0x127)]=function(_0x1c205c){var _0x15a6f3=_0x5d4413;return!!(_0x1c205c&&_0x29fdc9[_0x15a6f3(0x140)]&&this[_0x15a6f3(0x148)](_0x1c205c)==='[object\\x20Map]'&&_0x1c205c[_0x15a6f3(0x123)]);},_0x4ec6f8[_0x5d4413(0xa3)]['_propertyName']=function(_0x555f36){var _0x30eb10=_0x5d4413;if(_0x555f36[_0x30eb10(0xf4)](/^\\d+$/))return _0x555f36;var _0x459c76;try{_0x459c76=JSON['stringify'](''+_0x555f36);}catch{_0x459c76='\\x22'+this['_objectToString'](_0x555f36)+'\\x22';}return _0x459c76[_0x30eb10(0xf4)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x459c76=_0x459c76[_0x30eb10(0x10c)](0x1,_0x459c76[_0x30eb10(0x197)]-0x2):_0x459c76=_0x459c76[_0x30eb10(0xee)](/'/g,'\\x5c\\x27')[_0x30eb10(0xee)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x459c76;},_0x4ec6f8['prototype'][_0x5d4413(0x115)]=function(_0x37a2bc,_0x3d78b9,_0x2b32a2,_0x1a3790){var _0x17ed05=_0x5d4413;this[_0x17ed05(0x15e)](_0x37a2bc,_0x3d78b9),_0x1a3790&&_0x1a3790(),this[_0x17ed05(0x14c)](_0x2b32a2,_0x37a2bc),this['_treeNodePropertiesAfterFullValue'](_0x37a2bc,_0x3d78b9);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x15e)]=function(_0x34cae9,_0x275743){var _0xa3e7c2=_0x5d4413;this[_0xa3e7c2(0xde)](_0x34cae9,_0x275743),this[_0xa3e7c2(0x17c)](_0x34cae9,_0x275743),this[_0xa3e7c2(0xe2)](_0x34cae9,_0x275743),this[_0xa3e7c2(0x19a)](_0x34cae9,_0x275743);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xde)]=function(_0x32f5e5,_0x53a774){},_0x4ec6f8['prototype']['_setNodeQueryPath']=function(_0x41a6cf,_0x546223){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x170)]=function(_0x8faa79,_0x3cb609){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x15f)]=function(_0x470b4d){var _0x1c20a9=_0x5d4413;return _0x470b4d===this[_0x1c20a9(0xc7)];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x159)]=function(_0x5e1348,_0x3e13d3){var _0x210da8=_0x5d4413;this['_setNodeLabel'](_0x5e1348,_0x3e13d3),this['_setNodeExpandableState'](_0x5e1348),_0x3e13d3[_0x210da8(0x152)]&&this['_sortProps'](_0x5e1348),this[_0x210da8(0x153)](_0x5e1348,_0x3e13d3),this[_0x210da8(0x18a)](_0x5e1348,_0x3e13d3),this[_0x210da8(0x119)](_0x5e1348);},_0x4ec6f8[_0x5d4413(0xa3)]['_additionalMetadata']=function(_0x179ebd,_0x4a5428){var _0x29050a=_0x5d4413;try{_0x179ebd&&typeof _0x179ebd[_0x29050a(0x197)]==_0x29050a(0x108)&&(_0x4a5428[_0x29050a(0x197)]=_0x179ebd[_0x29050a(0x197)]);}catch{}if(_0x4a5428[_0x29050a(0x11a)]===_0x29050a(0x108)||_0x4a5428[_0x29050a(0x11a)]==='Number'){if(isNaN(_0x4a5428[_0x29050a(0x137)]))_0x4a5428[_0x29050a(0xbd)]=!0x0,delete _0x4a5428[_0x29050a(0x137)];else switch(_0x4a5428[_0x29050a(0x137)]){case Number['POSITIVE_INFINITY']:_0x4a5428[_0x29050a(0xab)]=!0x0,delete _0x4a5428['value'];break;case Number[_0x29050a(0x18c)]:_0x4a5428['negativeInfinity']=!0x0,delete _0x4a5428[_0x29050a(0x137)];break;case 0x0:this[_0x29050a(0x199)](_0x4a5428['value'])&&(_0x4a5428['negativeZero']=!0x0);break;}}else _0x4a5428['type']==='function'&&typeof _0x179ebd[_0x29050a(0x12f)]==_0x29050a(0x10b)&&_0x179ebd[_0x29050a(0x12f)]&&_0x4a5428['name']&&_0x179ebd[_0x29050a(0x12f)]!==_0x4a5428[_0x29050a(0x12f)]&&(_0x4a5428[_0x29050a(0x142)]=_0x179ebd[_0x29050a(0x12f)]);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x199)]=function(_0xff5555){var _0x2b82a9=_0x5d4413;return 0x1/_0xff5555===Number[_0x2b82a9(0x18c)];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x136)]=function(_0x243e50){var _0x4f6738=_0x5d4413;!_0x243e50['props']||!_0x243e50[_0x4f6738(0x16d)][_0x4f6738(0x197)]||_0x243e50[_0x4f6738(0x11a)]===_0x4f6738(0xb8)||_0x243e50['type']===_0x4f6738(0x140)||_0x243e50['type']===_0x4f6738(0xda)||_0x243e50[_0x4f6738(0x16d)][_0x4f6738(0xb2)](function(_0x49ebe3,_0x5a68f3){var _0x16ebcb=_0x4f6738,_0x58f5dc=_0x49ebe3[_0x16ebcb(0x12f)][_0x16ebcb(0xce)](),_0x3e8bb7=_0x5a68f3[_0x16ebcb(0x12f)]['toLowerCase']();return _0x58f5dc<_0x3e8bb7?-0x1:_0x58f5dc>_0x3e8bb7?0x1:0x0;});},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x153)]=function(_0x9397d1,_0x3506cd){var _0x46fa9c=_0x5d4413;if(!(_0x3506cd[_0x46fa9c(0x125)]||!_0x9397d1['props']||!_0x9397d1[_0x46fa9c(0x16d)][_0x46fa9c(0x197)])){for(var _0x33052e=[],_0x21b61c=[],_0x31e004=0x0,_0x3263d2=_0x9397d1[_0x46fa9c(0x16d)][_0x46fa9c(0x197)];_0x31e004<_0x3263d2;_0x31e004++){var _0x4367c0=_0x9397d1['props'][_0x31e004];_0x4367c0[_0x46fa9c(0x11a)]===_0x46fa9c(0xb0)?_0x33052e['push'](_0x4367c0):_0x21b61c['push'](_0x4367c0);}if(!(!_0x21b61c[_0x46fa9c(0x197)]||_0x33052e[_0x46fa9c(0x197)]<=0x1)){_0x9397d1[_0x46fa9c(0x16d)]=_0x21b61c;var _0x12a238={'functionsNode':!0x0,'props':_0x33052e};this[_0x46fa9c(0xde)](_0x12a238,_0x3506cd),this[_0x46fa9c(0x170)](_0x12a238,_0x3506cd),this[_0x46fa9c(0xe0)](_0x12a238),this[_0x46fa9c(0x19a)](_0x12a238,_0x3506cd),_0x12a238['id']+='\\x20f',_0x9397d1[_0x46fa9c(0x16d)][_0x46fa9c(0x12d)](_0x12a238);}}},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x18a)]=function(_0x2d3e19,_0x46799d){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xe0)]=function(_0x3f0cab){},_0x4ec6f8[_0x5d4413(0xa3)]['_isArray']=function(_0x3dacb5){var _0x350e08=_0x5d4413;return Array[_0x350e08(0x146)](_0x3dacb5)||typeof _0x3dacb5==_0x350e08(0xcb)&&this[_0x350e08(0x148)](_0x3dacb5)===_0x350e08(0x151);},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x19a)]=function(_0x10e2b9,_0x1ff96f){},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0x119)]=function(_0x516e14){var _0x27970f=_0x5d4413;delete _0x516e14[_0x27970f(0x147)],delete _0x516e14[_0x27970f(0x121)],delete _0x516e14[_0x27970f(0x174)];},_0x4ec6f8[_0x5d4413(0xa3)][_0x5d4413(0xe2)]=function(_0x211393,_0x4c093d){};let _0x5a6ee8=new _0x4ec6f8(),_0x58ea8f={'props':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0x16d)]||0x64,'elements':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xd0)]||0x64,'strLength':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0x130)]||0x400*0x32,'totalStrLength':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xd9)]||0x400*0x32,'autoExpandLimit':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xe6)]||0x1388,'autoExpandMaxDepth':_0x16053c[_0x5d4413(0xae)][_0x5d4413(0xa2)]||0xa},_0x5794d0={'props':_0x16053c[_0x5d4413(0x131)]['props']||0x5,'elements':_0x16053c['reducedLimits'][_0x5d4413(0xd0)]||0x5,'strLength':_0x16053c[_0x5d4413(0x131)][_0x5d4413(0x130)]||0x100,'totalStrLength':_0x16053c[_0x5d4413(0x131)]['totalStrLength']||0x100*0x3,'autoExpandLimit':_0x16053c[_0x5d4413(0x131)][_0x5d4413(0xe6)]||0x1e,'autoExpandMaxDepth':_0x16053c[_0x5d4413(0x131)]['autoExpandMaxDepth']||0x2};function _0x5d713e(_0x559ec1,_0x3bab4b,_0x2b0326,_0x398253,_0x25fe92,_0x276876){var _0x38c024=_0x5d4413;let _0x42c2fe,_0x3a7f23;try{_0x3a7f23=_0x1c7b58(),_0x42c2fe=_0x47d813[_0x3bab4b],!_0x42c2fe||_0x3a7f23-_0x42c2fe['ts']>_0xee9e24['perLogpoint'][_0x38c024(0xea)]&&_0x42c2fe[_0x38c024(0xed)]&&_0x42c2fe[_0x38c024(0x10f)]/_0x42c2fe['count']<_0xee9e24[_0x38c024(0x154)][_0x38c024(0xaa)]?(_0x47d813[_0x3bab4b]=_0x42c2fe={'count':0x0,'time':0x0,'ts':_0x3a7f23},_0x47d813['hits']={}):_0x3a7f23-_0x47d813[_0x38c024(0x180)]['ts']>_0xee9e24[_0x38c024(0x198)]['resetWhenQuietMs']&&_0x47d813[_0x38c024(0x180)][_0x38c024(0xed)]&&_0x47d813[_0x38c024(0x180)][_0x38c024(0x10f)]/_0x47d813[_0x38c024(0x180)][_0x38c024(0xed)]<_0xee9e24['global']['resetOnProcessingTimeAverageMs']&&(_0x47d813['hits']={});let _0x2beacd=[],_0xa238bf=_0x42c2fe[_0x38c024(0xf2)]||_0x47d813[_0x38c024(0x180)]['reduceLimits']?_0x5794d0:_0x58ea8f,_0x4de305=_0x404b01=>{var _0x295276=_0x38c024;let _0x3d542a={};return _0x3d542a[_0x295276(0x16d)]=_0x404b01['props'],_0x3d542a[_0x295276(0xd0)]=_0x404b01[_0x295276(0xd0)],_0x3d542a[_0x295276(0x130)]=_0x404b01['strLength'],_0x3d542a[_0x295276(0xd9)]=_0x404b01[_0x295276(0xd9)],_0x3d542a['autoExpandLimit']=_0x404b01[_0x295276(0xe6)],_0x3d542a[_0x295276(0xa2)]=_0x404b01[_0x295276(0xa2)],_0x3d542a[_0x295276(0x152)]=!0x1,_0x3d542a[_0x295276(0x125)]=!_0x2e6e58,_0x3d542a[_0x295276(0xeb)]=0x1,_0x3d542a['level']=0x0,_0x3d542a[_0x295276(0x110)]='root_exp_id',_0x3d542a[_0x295276(0x188)]=_0x295276(0x13b),_0x3d542a[_0x295276(0xcd)]=!0x0,_0x3d542a['autoExpandPreviousObjects']=[],_0x3d542a[_0x295276(0x12c)]=0x0,_0x3d542a[_0x295276(0x13f)]=_0x16053c[_0x295276(0x13f)],_0x3d542a[_0x295276(0x181)]=0x0,_0x3d542a[_0x295276(0xd4)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x3d542a;};for(var _0x4701b5=0x0;_0x4701b5<_0x25fe92[_0x38c024(0x197)];_0x4701b5++)_0x2beacd['push'](_0x5a6ee8[_0x38c024(0x105)]({'timeNode':_0x559ec1===_0x38c024(0x10f)||void 0x0},_0x25fe92[_0x4701b5],_0x4de305(_0xa238bf),{}));if(_0x559ec1===_0x38c024(0x124)||_0x559ec1==='error'){let _0x6a96d1=Error[_0x38c024(0xc3)];try{Error[_0x38c024(0xc3)]=0x1/0x0,_0x2beacd['push'](_0x5a6ee8[_0x38c024(0x105)]({'stackNode':!0x0},new Error()[_0x38c024(0xdd)],_0x4de305(_0xa238bf),{'strLength':0x1/0x0}));}finally{Error[_0x38c024(0xc3)]=_0x6a96d1;}}return{'method':'log','version':_0x2fc14c,'args':[{'ts':_0x2b0326,'session':_0x398253,'args':_0x2beacd,'id':_0x3bab4b,'context':_0x276876}]};}catch(_0x288391){return{'method':_0x38c024(0x1a2),'version':_0x2fc14c,'args':[{'ts':_0x2b0326,'session':_0x398253,'args':[{'type':'unknown','error':_0x288391&&_0x288391[_0x38c024(0x19b)]}],'id':_0x3bab4b,'context':_0x276876}]};}finally{try{if(_0x42c2fe&&_0x3a7f23){let _0x5ad3d3=_0x1c7b58();_0x42c2fe[_0x38c024(0xed)]++,_0x42c2fe['time']+=_0x57e37c(_0x3a7f23,_0x5ad3d3),_0x42c2fe['ts']=_0x5ad3d3,_0x47d813['hits']['count']++,_0x47d813[_0x38c024(0x180)]['time']+=_0x57e37c(_0x3a7f23,_0x5ad3d3),_0x47d813[_0x38c024(0x180)]['ts']=_0x5ad3d3,(_0x42c2fe[_0x38c024(0xed)]>_0xee9e24[_0x38c024(0x154)][_0x38c024(0xc6)]||_0x42c2fe['time']>_0xee9e24['perLogpoint'][_0x38c024(0x122)])&&(_0x42c2fe[_0x38c024(0xf2)]=!0x0),(_0x47d813[_0x38c024(0x180)][_0x38c024(0xed)]>_0xee9e24['global']['reduceOnCount']||_0x47d813[_0x38c024(0x180)][_0x38c024(0x10f)]>_0xee9e24[_0x38c024(0x198)]['reduceOnAccumulatedProcessingTimeMs'])&&(_0x47d813[_0x38c024(0x180)][_0x38c024(0xf2)]=!0x0);}}catch{}}}return _0x5d713e;}((_0x203b5a,_0x30b7c7,_0x324cef,_0x27f652,_0x48e15b,_0x5bb317,_0x3fb50f,_0x343a8,_0x49d5d3,_0x205017,_0x264412,_0x476e4f)=>{var _0x37c213=_0x206025;if(_0x203b5a[_0x37c213(0x14e)])return _0x203b5a[_0x37c213(0x14e)];let _0x591ad1={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!H(_0x203b5a,_0x343a8,_0x48e15b))return _0x203b5a[_0x37c213(0x14e)]=_0x591ad1,_0x203b5a['_console_ninja'];let _0x540ede=B(_0x203b5a),_0x468f43=_0x540ede[_0x37c213(0x12b)],_0x514c25=_0x540ede[_0x37c213(0xec)],_0x53eba8=_0x540ede[_0x37c213(0xd1)],_0x1585a8={'hits':{},'ts':{}},_0x2e4709=X(_0x203b5a,_0x49d5d3,_0x1585a8,_0x5bb317,_0x476e4f),_0x2898c2=(_0x163a2f,_0x3623fa,_0x3f5713,_0x316379,_0x1b0b41,_0x564147)=>{var _0x4f1607=_0x37c213;let _0x3730c8=_0x203b5a[_0x4f1607(0x14e)];try{return _0x203b5a[_0x4f1607(0x14e)]=_0x591ad1,_0x2e4709(_0x163a2f,_0x3623fa,_0x3f5713,_0x316379,_0x1b0b41,_0x564147);}finally{_0x203b5a[_0x4f1607(0x14e)]=_0x3730c8;}},_0x14f15a=_0x1ee0b5=>{_0x1585a8['ts'][_0x1ee0b5]=_0x514c25();},_0x2c00f7=(_0x26ccbf,_0x14ea2f)=>{let _0x48585e=_0x1585a8['ts'][_0x14ea2f];if(delete _0x1585a8['ts'][_0x14ea2f],_0x48585e){let _0xac0e=_0x468f43(_0x48585e,_0x514c25());_0x1941f0(_0x2898c2('time',_0x26ccbf,_0x53eba8(),_0x17718d,[_0xac0e],_0x14ea2f));}},_0x31320e=_0x3349e3=>{var _0xc2d4c3=_0x37c213,_0x1a6fc7;return _0x48e15b==='next.js'&&_0x203b5a[_0xc2d4c3(0xca)]&&((_0x1a6fc7=_0x3349e3==null?void 0x0:_0x3349e3[_0xc2d4c3(0x113)])==null?void 0x0:_0x1a6fc7[_0xc2d4c3(0x197)])&&(_0x3349e3['args'][0x0][_0xc2d4c3(0xca)]=_0x203b5a[_0xc2d4c3(0xca)]),_0x3349e3;};_0x203b5a[_0x37c213(0x14e)]={'consoleLog':(_0x587d5a,_0x4a2aed)=>{var _0x14d3d4=_0x37c213;_0x203b5a[_0x14d3d4(0x15b)]['log'][_0x14d3d4(0x12f)]!=='disabledLog'&&_0x1941f0(_0x2898c2(_0x14d3d4(0x1a2),_0x587d5a,_0x53eba8(),_0x17718d,_0x4a2aed));},'consoleTrace':(_0x41ced6,_0x4beb53)=>{var _0x490de8=_0x37c213,_0x437ded,_0x2f3a5c;_0x203b5a[_0x490de8(0x15b)][_0x490de8(0x1a2)][_0x490de8(0x12f)]!==_0x490de8(0x14f)&&((_0x2f3a5c=(_0x437ded=_0x203b5a[_0x490de8(0x128)])==null?void 0x0:_0x437ded[_0x490de8(0x13c)])!=null&&_0x2f3a5c[_0x490de8(0xd4)]&&(_0x203b5a[_0x490de8(0x196)]=!0x0),_0x1941f0(_0x31320e(_0x2898c2(_0x490de8(0x124),_0x41ced6,_0x53eba8(),_0x17718d,_0x4beb53))));},'consoleError':(_0x4816b9,_0x8b9537)=>{var _0x11a235=_0x37c213;_0x203b5a[_0x11a235(0x196)]=!0x0,_0x1941f0(_0x31320e(_0x2898c2(_0x11a235(0x118),_0x4816b9,_0x53eba8(),_0x17718d,_0x8b9537)));},'consoleTime':_0x5d5cdd=>{_0x14f15a(_0x5d5cdd);},'consoleTimeEnd':(_0x509cca,_0x533215)=>{_0x2c00f7(_0x533215,_0x509cca);},'autoLog':(_0x3e3e0e,_0x239569)=>{_0x1941f0(_0x2898c2('log',_0x239569,_0x53eba8(),_0x17718d,[_0x3e3e0e]));},'autoLogMany':(_0x5396f2,_0x2e21a4)=>{var _0x24649c=_0x37c213;_0x1941f0(_0x2898c2(_0x24649c(0x1a2),_0x5396f2,_0x53eba8(),_0x17718d,_0x2e21a4));},'autoTrace':(_0xc5a86f,_0x284f0e)=>{var _0x19371e=_0x37c213;_0x1941f0(_0x31320e(_0x2898c2(_0x19371e(0x124),_0x284f0e,_0x53eba8(),_0x17718d,[_0xc5a86f])));},'autoTraceMany':(_0x2186d5,_0x539807)=>{_0x1941f0(_0x31320e(_0x2898c2('trace',_0x2186d5,_0x53eba8(),_0x17718d,_0x539807)));},'autoTime':(_0x1b9356,_0x1765d1,_0x1fe25f)=>{_0x14f15a(_0x1fe25f);},'autoTimeEnd':(_0x1a985f,_0x4488ae,_0x49e434)=>{_0x2c00f7(_0x4488ae,_0x49e434);},'coverage':_0x33489e=>{var _0x32d229=_0x37c213;_0x1941f0({'method':_0x32d229(0xad),'version':_0x5bb317,'args':[{'id':_0x33489e}]});}};let _0x1941f0=q(_0x203b5a,_0x30b7c7,_0x324cef,_0x27f652,_0x48e15b,_0x205017,_0x264412),_0x17718d=_0x203b5a[_0x37c213(0x14a)];return _0x203b5a[_0x37c213(0x14e)];})(globalThis,'127.0.0.1',_0x206025(0x163),_0x206025(0x166),'next.js',_0x206025(0x135),_0x206025(0x177),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"10.0.2.2\",\"Aashish\",\"192.168.1.4\"],'',_0x206025(0xfe),_0x206025(0x156),_0x206025(0x12e));");
    } catch (e) {
        console.error(e);
    }
}
function oo_oo(i, ...v) {
    try {
        oo_cm().consoleLog(i, v);
    } catch (e) {}
    return v;
}
oo_oo; /* istanbul ignore next */ 
function oo_tr(i, ...v) {
    try {
        oo_cm().consoleTrace(i, v);
    } catch (e) {}
    return v;
}
oo_tr; /* istanbul ignore next */ 
function oo_tx(i, ...v) {
    try {
        oo_cm().consoleError(i, v);
    } catch (e) {}
    return v;
}
oo_tx; /* istanbul ignore next */ 
function oo_ts(v) {
    try {
        oo_cm().consoleTime(v);
    } catch (e) {}
    return v;
}
oo_ts; /* istanbul ignore next */ 
function oo_te(v, i) {
    try {
        oo_cm().consoleTimeEnd(v, i);
    } catch (e) {}
    return v;
}
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/ 
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_ede2668c._.js.map