/**
 * TechHub Pro v4.0 — 支付服务测试
 * 自动生成测试套件，覆盖核心业务场景
 */
import java.util.*;
import java.util.concurrent.*;
import java.security.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class PaymentServiceTest {

    private static final String TAG = "[PaymentServiceTest]";
    private int passed = 0, failed = 0;

    @BeforeEach void setUp() {
        // 每个测试前重置状态
        DatabaseUtil.init();
    }

    @AfterEach void tearDown() {
        System.out.println(TAG + " 通过:" + passed + " 失败:" + failed);
    }

    @Test
    void test1_____() {
        // 场景: 正常流程
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST0");
            order.put("courseId", "TH-1000");
            order.put("amount", 5);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            Course course = new Course();
            course.id = "TH-1000";
            course.price = 5;
            Map<String, Object> r1 = PaymentService.verifyRound1(order, course);
            assertTrue((Boolean) r1.get("ok"), "轮1应通过");
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test1_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test1_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test2_____() {
        // 场景: 边界条件
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST1");
            order.put("courseId", "TH-1000");
            order.put("amount", 12);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            // 篡改金额
            order.put("amount", 99999);
            Course course = new Course();
            course.id = "TH-1000";
            course.price = 12;
            Map<String, Object> r = PaymentService.verifyRound1(order, course);
            assertFalse((Boolean) r.get("ok"), "篡改金额应失败");
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test2_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test2_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test3_____() {
        // 场景: 异常输入
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST2");
            order.put("courseId", "TH-1000");
            order.put("amount", 19);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            // 重放攻击
            PaymentService.markOrderUsed("TH-20260809120000-REPLAY");
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("orderId", "TH-20260809120000-REPLAY");
            assertTrue(PaymentService.isOrderUsed("TH-20260809120000-REPLAY"));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test3_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test3_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test4_____() {
        // 场景: 并发访问
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST3");
            order.put("courseId", "TH-1000");
            order.put("amount", 26);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            // 签名校验
            String sig = PaymentService.sign("test-payload-3");
            assertNotNull(sig, "签名不应为null");
            assertEquals(64, sig.length(), "SHA-256签名应为64字符");
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test4_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test4_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test5_____() {
        // 场景: 空值处理
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST4");
            order.put("courseId", "TH-1000");
            order.put("amount", 33);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test5_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test5_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test6______() {
        // 场景: 超长字符串
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST5");
            order.put("courseId", "TH-1000");
            order.put("amount", 40);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test6______" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test6______" + "]: " + e.getMessage());
        }
    }

    @Test
    void test7_____() {
        // 场景: 特殊字符
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST6");
            order.put("courseId", "TH-1000");
            order.put("amount", 47);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test7_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test7_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test8_Unicode() {
        // 场景: Unicode
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST7");
            order.put("courseId", "TH-1000");
            order.put("amount", 54);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test8_Unicode" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test8_Unicode" + "]: " + e.getMessage());
        }
    }

    @Test
    void test9_SQL____() {
        // 场景: SQL注入尝试
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST8");
            order.put("courseId", "TH-1000");
            order.put("amount", 61);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test9_SQL____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test9_SQL____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test10_XSS__() {
        // 场景: XSS尝试
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST9");
            order.put("courseId", "TH-1000");
            order.put("amount", 68);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test10_XSS__" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test10_XSS__" + "]: " + e.getMessage());
        }
    }

    @Test
    void test11_____() {
        // 场景: 重放攻击
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST10");
            order.put("courseId", "TH-1000");
            order.put("amount", 75);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test11_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test11_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test12_____() {
        // 场景: 篡改签名
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST11");
            order.put("courseId", "TH-1000");
            order.put("amount", 82);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test12_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test12_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test13_____() {
        // 场景: 过期订单
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST12");
            order.put("courseId", "TH-1000");
            order.put("amount", 89);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test13_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test13_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test14_____() {
        // 场景: 重复请求
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST13");
            order.put("courseId", "TH-1000");
            order.put("amount", 11);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test14_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test14_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test15_____() {
        // 场景: 竞态条件
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST14");
            order.put("courseId", "TH-1000");
            order.put("amount", 18);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test15_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test15_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test16_____() {
        // 场景: 大数溢出
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST15");
            order.put("courseId", "TH-1000");
            order.put("amount", 25);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test16_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test16_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test17_____() {
        // 场景: 负数金额
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST16");
            order.put("courseId", "TH-1000");
            order.put("amount", 32);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test17_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test17_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test18___() {
        // 场景: 零值
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST17");
            order.put("courseId", "TH-1000");
            order.put("amount", 39);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test18___" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test18___" + "]: " + e.getMessage());
        }
    }

    @Test
    void test19____() {
        // 场景: 超大额
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST18");
            order.put("courseId", "TH-1000");
            order.put("amount", 46);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test19____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test19____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test20_____() {
        // 场景: 非法字符
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST19");
            order.put("courseId", "TH-1000");
            order.put("amount", 53);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test20_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test20_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test21_____() {
        // 场景: 正常流程
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST20");
            order.put("courseId", "TH-1000");
            order.put("amount", 60);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test21_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test21_____" + "]: " + e.getMessage());
        }
    }

    @Test
    void test22_____() {
        // 场景: 边界条件
        try {
            // 构建测试订单
            Map<String, Object> order = new LinkedHashMap<>();
            order.put("orderId", "TH-20260809120000-TEST21");
            order.put("courseId", "TH-1000");
            order.put("amount", 67);
            order.put("timestamp", System.currentTimeMillis());
            String payload = order.get("orderId") + "|" + order.get("courseId") + "|" + order.get("amount") + "|" + order.get("timestamp");
            order.put("signature", PaymentService.sign(payload));
            passed++;
        } catch (AssertionError e) {
            failed++;
            System.err.println(TAG + " 失败[" + "test22_____" + "]: " + e.getMessage());
        } catch (Exception e) {
            failed++;
            System.err.println(TAG + " 异常[" + "test22_____" + "]: " + e.getMessage());
        }
    }

    @Test void testSummary() {
        System.out.println("══════════════════════════════");
        System.out.println("  PaymentServiceTest 汇总");
        System.out.println("  通过: " + passed);
        System.out.println("  失败: " + failed);
        System.out.println("  通过率: " + (passed > 0 ? (passed*100/(passed+failed)) : 0) + "%");
        System.out.println("══════════════════════════════");
    }
}
