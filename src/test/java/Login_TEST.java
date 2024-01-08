import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.poi.ss.usermodel.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.*;

class Login_TEST {

    static WebDriver driver;
    static Login_POM login;


    @BeforeAll
    public static void createDriver() {
        final String browser = System.getProperty("browser", "chrome").toLowerCase();

        switch (browser) {
            case "chrome":
                ChromeOptions optionsC = new ChromeOptions();
                optionsC.addArguments("--headless");
                WebDriverManager.chromedriver().setup();
                driver = new ChromeDriver(optionsC);
                break;

            case "firefox":
                FirefoxOptions optionsF = new FirefoxOptions();
                optionsF.addArguments("--headless");
                WebDriverManager.firefoxdriver().setup();
                driver = new FirefoxDriver(optionsF);
                break;

            case "safari":
                WebDriverManager.safaridriver().setup();
                driver = new SafariDriver();
                driver.manage().window().maximize();
                break;

            default:
                throw new RuntimeException("Invalid browser specified!");
        }
    }

    @BeforeEach
    public void setupPage() throws InterruptedException {
        login = new Login_POM(driver);
        login.navigateLogin();
    }

    @AfterEach
    public void clearBrowserStorage() {
//        login.clearLocalStorage();
    }

    @AfterAll
    public static void closeBrowser() {
        driver.quit();
    }

    @RegisterExtension
    ScreenshotWatcher watcher = new ScreenshotWatcher(driver, "failed_screenshots");

    private static Iterable<Object[]> getLoginData() throws IOException {
        String filePath = "src/test/resources/login_data.xlsx";
        String sheetName = "Sheet1";

        Workbook workbook = WorkbookFactory.create(new FileInputStream(filePath));
        Sheet sheet = workbook.getSheet(sheetName);

        Iterator<Row> rowIterator = sheet.rowIterator();
        Collection<Object[]> data = new ArrayList<>();

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Cell emailCell = row.getCell(0);
            Cell passwordCell = row.getCell(1);

            String email = emailCell.getStringCellValue().trim();
            String password = passwordCell.getStringCellValue().trim();

            // Skip the row if both email and password are empty
            if (!email.isEmpty() || !password.isEmpty()) {
                data.add(new Object[]{email, password});
            }
        }

        workbook.close();
        return data;
    }

    @ParameterizedTest
    @MethodSource("getLoginData")
    void testLoginWithCredentials(String email, String password) {
        login.loggingIn(email, password);
        // Add assertions for successful login or whatever you need to test
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofMillis(500));
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/lobby"));
        assertEquals("http://localhost:3000/lobby", driver.getCurrentUrl());

    }

    @Test void checkPageTitleName() {
        // This title is meant to change as it is currently using the default React title
        assertEquals("React App", driver.getTitle());
    }

    @Test
    void userLogsInRedirectedToLobby() throws InterruptedException {
        login.loggingIn("test@test.com", "55555");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofMillis(500));
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/lobby"));
        assertEquals("http://localhost:3000/lobby", driver.getCurrentUrl());
    }

    @Test
    void testWithInvalidCredentials(){
        login.loggingIn("fakeemail@fake.com", "Fakepwd123!");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofMillis(500));
        wait.until(ExpectedConditions.visibilityOf(login.loginErrorMessage));
        assertTrue(login.loginErrorMessage.isDisplayed());
        assertEquals("http://localhost:3000/login", driver.getCurrentUrl());
    }

    @Test
    void testWithEmptyFields(){
        login.loggingIn("", "");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofMillis(500));
        wait.until(ExpectedConditions.visibilityOf(login.loginErrorMessage));
        assertTrue(login.loginErrorMessage.isDisplayed());
        assertEquals("http://localhost:3000/login", driver.getCurrentUrl());
    }

    @Test
    void checksPasswordIsHidden(){
        login.inputPassword.click();
        login.inputPassword.sendKeys("randompassword");
        assertEquals("password", login.inputPassword.getAttribute("type"));
    }

    @Test
     void checksPasswordIsDisplayed(){
        login.inputPassword.click();
        login.inputPassword.sendKeys("randompassword");
        login.passwordShowButton.click();
        assertEquals("text", login.inputPassword.getAttribute("type"));
    }

    @Test
    void checkErrorMessageWithInvalidOrEmptyFields(){
        /* This error message is expected to change from "or password" to
        "and password". Please refer to the bug tracker and Log In test report.
    */
        login.submitLoginButton.click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(1));
        wait.until(ExpectedConditions.visibilityOf(login.loginErrorMessage));
        assertTrue(login.loginErrorMessage.isDisplayed());
        assertEquals("Enter a valid email or password", login.loginErrorMessage.getText());
    }

    @Test
    void checksRegisterLinkIsPresentAndRedirectsToSignupPage(){
        assertTrue(login.registerLink.isDisplayed());
        login.registerLink.click();
        assertEquals("http://localhost:3000/signup", driver.getCurrentUrl());
    }


}