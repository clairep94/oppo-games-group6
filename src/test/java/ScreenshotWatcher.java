import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;


public class ScreenshotWatcher implements TestWatcher {

    WebDriver driver;
    String path;

    public ScreenshotWatcher(WebDriver driver, String path) {
        this.driver = driver;
        this.path = path;
    }


    @Override
    public void testFailed(ExtensionContext context, Throwable throwable) {
        captureScreenshot(driver, context.getDisplayName());
    }


    public void captureScreenshot(WebDriver driver, String fileName) {
        try {
            new File(path).mkdirs();
            try ( FileOutputStream out = new FileOutputStream(path + File.separator + "screenshot-" + fileName + ".png")) {
                out.write(((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES));
            }
        } catch (IOException | WebDriverException e) {
            System.out.println("screenshot failed:" + e.getMessage());
        }
    }

}