# Java实现邮件发送功能

> 使用的 jar：==mail-1.5.0-b01.jar==、==activation-1.1.1.jar==

#### 获取授权码：QQ邮箱

![](../markdown/img/0B070CC.png)

![](../markdown/img/57C2EB992.png)

#### 发送邮件的工具类

```java
import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Enumeration;
import java.util.Properties;
import java.util.Vector;
/**
 * 邮件发送工具类
 * @author monako
 * @Date   2019年6月22日 上午10:34:41
 */
public class MailUtil {
    /**
     * SMTP服务器名，可以从 QQ 邮箱的帮助文档查到
     * 文档地址：https://service.mail.qq.com/cgi-bin/help?subtype=1&no=167&id=28
     * */
    String host = "smtp.qq.com";
    /**
     * SMTP服务器端口号
     * 可以从 QQ 邮箱的帮助文档查到，端口为 465 或 587
     * */
    int port = 587;
    /**
     * 发件人邮箱地址
     * */
    String from = "发件人邮箱地址";
    /**
     * 发件人用户名
     * */
    String username = "发件人用户名";
    /**
     * 发件人密码
     * */
    String password = "发件人密码";
    /**
     * 收件人邮箱地址
     * */
    String to;
    /**
     * 附件文件名
     * */
    String filename = "";
    /**
     * 邮件主题
     * */
    String subject;
    /**
     * 邮件正文
     * */
    String content;
    /**
     * 附件文件集合
     * */
    Vector<String> file = new Vector<>();
    
    public MailUtil(String to, String subject, String content) {
        this.to = to;
        this.subject = subject;
        this.content = content;
    }

    /**
     * 把主题转为中文 utf8
     * @param strText 字符串
     * @author monako
     */
    public String transferChinese(String strText) {
        try {
            strText = MimeUtility.encodeText(new String(strText.getBytes(),
                    StandardCharsets.UTF_8), "utf-8", "B");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return strText;
    }

    public void attachFile(String fileName) {
        file.addElement(fileName);
    }

    /**
     * 发送邮件，发送成功返回true 失败false
     * @author monako
     */
    public boolean sendMail() {
        // 构造mail session
        Properties props = new Properties();
        // 连接协议
        props.put("mail.transport.protocol", "smtp");
        // SMTP 服务器名
        props.put("mail.smtp.host", host);
        // 是否需要身份验证
        props.put("mail.smtp.auth", "true");
        // SMTP 服务器端口号
        props.put("mail.smtp.port", port);
        Session session = Session.getDefaultInstance(props,
                new Authenticator() {
                    @Override
                    public PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {
            // 构造MimeMessage 并设定基本的值
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(from));

            msg.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(to));
            subject = transferChinese(subject);
            msg.setSubject(subject);

            // 构造Multipart
            Multipart mp = new MimeMultipart();

            // 向Multipart添加正文
            MimeBodyPart mbpContent = new MimeBodyPart();
            mbpContent.setContent(content, "text/html;charset=utf-8");

            // 向MimeMessage添加（Multipart代表正文）
            mp.addBodyPart(mbpContent);

            // 向Multipart添加附件
            Enumeration<String> efile = file.elements();
            while (efile.hasMoreElements()) {

                MimeBodyPart mbpFile = new MimeBodyPart();
                filename = efile.nextElement();
                FileDataSource fds = new FileDataSource(filename);
                mbpFile.setDataHandler(new DataHandler(fds));
                String filename = new String(fds.getName().getBytes(), StandardCharsets.ISO_8859_1);

                mbpFile.setFileName(filename);
                // 向MimeMessage添加（Multipart代表附件）
                mp.addBodyPart(mbpFile);

            }

            file.removeAllElements();
            // 向Multipart添加MimeMessage
            msg.setContent(mp);
            msg.setSentDate(new Date());
            msg.saveChanges();

            // 发送邮件
            Transport transport = session.getTransport("smtp");
            transport.connect(host, username, password);
            transport.sendMessage(msg, msg.getAllRecipients());
            transport.close();
        } catch (Exception mex) {
            mex.printStackTrace();
            return false;
        }
        return true;
    }
}
```

#### 使用

```java
// 发送邮件
MailUtil sendmail = new MailUtil("邮箱", "标题", "正文");
// 添加附件
sendmail.attachFile("附件地址");
// 邮件发送成功返回 true
boolean isMail = sendmail.sendMail();
```

