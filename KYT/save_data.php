<?php
// 阿里云虚拟主机数据库信息（替换成你的）
$servername = "sdm723419132.my3w.com";   // 你截图里的数据库地址
$username = "sdm723419132";               // 你截图里的数据库用户名
$password = "Boshun810";        // 你自己设的数据库密码
$dbname = "sdm723419132_db";              // 你截图里的数据库名

// 解决中文乱码
header('Content-Type: application/json; charset=utf-8');

// 连接数据库
$conn = new mysqli($servername, $username, $password, $dbname);
// 检查连接
if ($conn->connect_error) {
    die(json_encode(["success" => false, "msg" => "数据库连接失败：" . $conn->connect_error]));
}

// 接收前端传过来的数据（根据你实际的字段改，比如你传的是title/phone/content，就对应改）
$name = isset($_POST['name']) ? $_POST['name'] : ''; // 数据名称/标题
$content = isset($_POST['content']) ? $_POST['content'] : ''; // 数据内容
$phone = isset($_POST['phone']) ? $_POST['phone'] : ''; // 可选：如果有电话字段就加
$email = isset($_POST['email']) ? $_POST['email'] : ''; // 可选：如果有邮箱字段就加

// 验证数据不为空
if (empty($name) || empty($content)) {
    echo json_encode(["success" => false, "msg" => "名称和内容不能为空"]);
    exit;
}

// 把数据插入数据库（如果有phone/email，就加到SQL里）
$sql = "INSERT INTO data_table (name, content, phone, email) VALUES ('$name', '$content', '$phone', '$email')";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "msg" => "数据上传成功，所有设备都能看到了！"]);
} else {
    echo json_encode(["success" => false, "msg" => "上传失败：" . $conn->error]);
}

// 关闭数据库连接
$conn->close();
?>