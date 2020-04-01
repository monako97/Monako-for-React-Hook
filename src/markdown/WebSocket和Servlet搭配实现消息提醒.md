[TOC]

# WebSocket和Servlet搭配实现消息提醒

#### 新建一个GetHttpSessionConfigurator类，并继承Configurator类

> 使用的 Tomcat 自带的 websocket.jar

```java
import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;
/**
 * 获取 session 所在的 httpSession
 * @author monako
 */
public class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator {
    @Override
    public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
        HttpSession httpSession = (HttpSession) request.getHttpSession();
        sec.getUserProperties().put(HttpSession.class.getName(), httpSession);
    }
}
```

#### 在@ServerEndpoint注解里面添加configurator属性

```java
@ServerEndpoint(value = "/websocket", configurator = GetHttpSessionConfigurator.class)
```

#### WebSocket类

```java
import com.monako.club.doMain.SocketMessageBean;
import com.monako.club.doMain.UserBean;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@ServerEndpoint(value = "/websocket", configurator = GetHttpSessionConfigurator.class)
public class WebSocketEndpoint {
    // 保存所有的用户session
    private static Map<String, Session> SESSION_MAP = new Hashtable<>();
    // 保存所有的用户sessionId对应的httpSessionId
    private static Map<String, String> HTTP_SESSION_MAP = new Hashtable<>();
    // 单点登录：绑定用户的 id 和 httpSession，当二者不一致时，对旧设备发送登出指令
    public static Map<String, String> USER_BY_HTTP_SESSION_MAP = new Hashtable<>();
    // 消息池: 用户id --> [消息1，消息2]
    public static Map<String, List<Map<String, String>>> TOAST_MAP = new Hashtable<>();
    // 在线人数
    private static final AtomicLong count = new AtomicLong();
    @OnOpen
    public void onOpen(Session session, EndpointConfig config) throws IOException {
        // 获取 httpSession
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        // 从 httpSession 中获取用户信息
        Object visitor = httpSession.getAttribute(httpSession.getId());
        UserBean userBean = JSONObject.parseObject(JSONObject.toJSONString(visitor), new TypeReference<UserBean>(){});
        SocketMessageBean messageBean = new SocketMessageBean();
        if (userBean!=null) {
        	String userId = Integer.toString(userBean.getId());
            // 如果用户登陆过，绑定用户和httpSession是否一致，不一致则推出
            if (USER_BY_HTTP_SESSION_MAP.get(userId).equals(httpSession.getId())){
                USER_BY_HTTP_SESSION_MAP.replace(userId, httpSession.getId());
                // 发送用户信息
                messageBean.setMessage("欢迎回来："+userBean.getUsername());
                messageBean.setType("userInfo");
                messageBean.setData(userBean);
            } else {
                // httpSession不一致，可能是socket掉线导致没有清除，所以这里清除
                messageBean.setMessage("账号已在别处登陆");
                messageBean.setType("loginOut");
                messageBean.setData(null);
            }
        } else {
            messageBean.setMessage("发现了一个未知生物");
            messageBean.setType("init");
            messageBean.setData(null);
        }
        // 保持session会话
        SESSION_MAP.put(httpSession.getId(), session);
        // 保存session对应的httpSession
        HTTP_SESSION_MAP.put(session.getId(), httpSession.getId());
        // 发送消息给前端
        sendByUser(session, JSON.toJSONString(messageBean));
        // 给所有人更新在线人数
        online();
    }
    /**
     * 在线人数
     */
    // 在线人数
    public static void online() throws IOException {
        SocketMessageBean messageBean = new SocketMessageBean();
        messageBean.setMessage("在线人数:" + count.incrementAndGet());
        messageBean.setType("online");
        sendByAll(JSON.toJSONString(messageBean));
    }

    /**
     * 单点登陆 绑定 user 和 httpSession
     * @param httpSession httpSession
     * @param userId 用户id
     */
    public static void bingHttpSession(HttpSession httpSession, String userId) throws IOException {
        // 当用户未和当前httpSession绑定时，进行绑定
        // 判断Map集合对象中是否包含指定的键名
        if (!USER_BY_HTTP_SESSION_MAP.containsKey(userId)) {
            USER_BY_HTTP_SESSION_MAP.put(userId, httpSession.getId());
            System.out.println("单点登录：用户 "+userId+" 和"+httpSession.getId()+"完成绑定");
        } else {
            // 如果保存过用户，那么执行单点登陆
            singleSignOn(httpSession, userId);
        }
    }

    /**
     * 单点登录 Single Sign On
     * @param httpSession httpSession
     * @param userId 用户id
     */
    public static void singleSignOn(HttpSession httpSession, String userId) throws IOException {
        // 账号之前的 httpSession
        String oldHttpSessionId = USER_BY_HTTP_SESSION_MAP.get(userId);
        if (!oldHttpSessionId.equals(httpSession.getId())){
            System.out.println("单点登录：用户 "+userId+"登录设备变更，登出 "+oldHttpSessionId+" 旧设备");
            // 将 USER_BY_HTTP_SESSION_MAP 中的 httpSession 修改为新的
            USER_BY_HTTP_SESSION_MAP.replace(userId, oldHttpSessionId, httpSession.getId());
            System.out.println("单点登录：用户 "+userId+"重新和"+httpSession.getId()+"完成绑定");
            // 删除服务器内存中旧 session 保存的用户信息
            httpSession.removeAttribute(oldHttpSessionId);
            System.out.println("单点登录：旧设备 "+oldHttpSessionId+" 绑定信息已解除");
            // 不在同一设备登陆，推出旧设备
            loginOut(oldHttpSessionId, "账号已在别处登陆");
        }
    }
    /**
     * 推出登陆设备
     * @param httpSessionId httpSession
     * @param message 消息文字
     * */
    public static void loginOut(String httpSessionId, String message) throws IOException {
        SocketMessageBean messageBean = new SocketMessageBean();
        messageBean.setMessage(message);
        messageBean.setType("loginOut");
        sendByUser(httpSessionId, JSON.toJSONString(messageBean));
    }
    /**
     * 通过session获取userId
     * @param session session
     */
    public String getUserId(Session session){
        String HTTP_SESSION = HTTP_SESSION_MAP.get(session.getId());
        String userId = "游客";
        // 通过 value 获取map中对应的 key
        // for循环的方式
        for (Map.Entry<String, String> map : USER_BY_HTTP_SESSION_MAP.entrySet())  {
            if (map.getValue().equals(HTTP_SESSION)) {
            	userId = map.getKey();
            }
        }
        return userId;
    }
    /**
     * 通过httpSessionId获取userId
     * @param httpSessionId httpSessionId
     */
    public String getUserId(String httpSessionId){
    	String userId = "游客";
        // 通过 value 获取map中对应的 key
        // for循环的方式
        for (Map.Entry<String, String> map : USER_BY_HTTP_SESSION_MAP.entrySet())  {
            if (map.getValue().equals(httpSessionId)) {
            	userId = map.getKey();
            }
        }
        return userId;
    }
    @OnMessage
    public void onMessage(Session session, String message) {
    	String userId = getUserId(session);
        System.out.println(userId + ": " + message);
    }

    @OnError
    public void onError(Throwable t) {
        System.err.println("WebSocket: 出错了");
        t.printStackTrace();
    }

    @OnClose
    public void onClose(Session session) throws IOException {
        // 删除 httpSessionId 指引的 session
        SESSION_MAP.remove(HTTP_SESSION_MAP.get(session.getId()));
        // 删除 sessionId 指引的 httpSession
        HTTP_SESSION_MAP.remove(session.getId());
        session.close();
        SocketMessageBean messageBean = new SocketMessageBean();
        messageBean.setMessage("在线人数:" + count.decrementAndGet());
        messageBean.setType("online");
        sendByAll(JSON.toJSONString(messageBean));
    }

    /**
     * 向指定用户发送消息
     * @param session session
     * @param message 发送的内容
     */
    public static void sendByUser(Session session, String message) throws IOException {
        session.getBasicRemote().sendText(message);
    }

    /**
     * 向指定用户发送消息
     * @param httpSession httpSession
     * @param message 发送的内容
     */
    public static void sendByUser(String httpSession, String message) throws IOException {
        SESSION_MAP.get(httpSession).getBasicRemote().sendText(message);
    }

    /**
     * 向所有用户发送
     * @param message 发送的内容
     */
    public static void sendByAll(String message) throws IOException {
        // 遍历连接的session
        for (Session session : SESSION_MAP.values()) {
            sendByUser(session, message);
        }
    }
}
```

