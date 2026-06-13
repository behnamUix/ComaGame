import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  // مدیریت وضعیت‌های بازی
  const [randomNumber, setRandomNumber] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState(3.5);
  const [gameState, setGameState] = useState("START"); // START, PLAYING, RESULT
  const [gameMessage, setGameMessage] = useState("");

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // شروع بازی جدید
  const startGame = () => {
    const num = Math.floor(10000 + Math.random() * 90000).toString();

    setRandomNumber(num);
    setDisplayText(num); // ابتدا عدد را نشان میدهیم
    setUserInput("");
    setTimer(3.5);
    setGameMessage("");
    setGameState("PLAYING");

    // افکت شبیه به Thread.sleep در کاتلین (بعد از ۳۰۰ میلی ثانیه عدد ستاره می‌شود)
    setTimeout(() => {
      setDisplayText("*".repeat(num.length));
      startTimeRef.current = Date.now(); // شروع محاسبه زمان دقیق کاربر
      startCountdown();
    }, 150);
  };

  // تایمر بازی
  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let currentTimer = 3.5;
    timerRef.current = setInterval(() => {
      currentTimer = parseFloat((currentTimer - 0.1).toFixed(1));

      if (currentTimer <= 0) {
        clearInterval(timerRef.current);
        setTimer(0.0);
        gameOver(false, "زمان تمام شد! خیلی کند بودی ⏱️");
      } else {
        setTimer(currentTimer);
      }
    }, 80);
  };

  // بررسی برنده یا بازنده شدن
  const checkAnswer = (text) => {
    setUserInput(text);

    if (text.length === randomNumber.length) {
      clearInterval(timerRef.current);
      Keyboard.dismiss(); // بستن کیبورد

      const endTime = Date.now();
      const timeTaken = ((endTime - startTimeRef.current) / 1000).toFixed(1);

      if (text === randomNumber) {
        gameOver(true, `شما بردید! 🎉\nزمان شما: ${timeTaken} ثانیه`);
      } else {
        gameOver(false, `باختید! ❌\nعدد درست: ${randomNumber} بود.`);
      }
    }
  };

  // اتمام بازی
  const gameOver = (isWin, message) => {
    setGameMessage(message);
    setGameState("RESULT");
  };

  // پاکسازی تایمر هنگام خروج از برنامه
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <View style={styles.container}>
      {/* بخش هدر و ایموجی‌ها */}
      <Text style={styles.title}>بازی کُما </Text>
      {gameState === "START" && (
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>شروع بازی</Text>
        </TouchableOpacity>
      )}
      {gameState === "PLAYING" && (
        <View style={styles.gameArea}>
          <Text style={styles.wordText}>{displayText}</Text>
          <Text style={styles.timerText}>
            زمان باقی‌مانده: {timer.toFixed(1)} ثانیه
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={5}
            value={userInput}
            onChangeText={checkAnswer}
            placeholder="عدد رو وارد کن..."
            placeholderTextColor="#888"
            autoFocus={true}
          />
        </View>
      )}
      {gameState === "RESULT" && (
        <View style={styles.resultArea}>
          <Text style={styles.messageText}>{gameMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>دوباره تلاش کن</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// استایل‌ها (CSS-like) برای زیباسازی برنامه
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    padding: 30,
    backgroundColor: "#1e1e1e",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  emojiText: {
    fontSize: 40,
    marginBottom: 10,
  },
  gameArea: {
    alignItems: "center",
    width: "100%",
  },
  wordText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#00ffcc",
    letterSpacing: 10,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 20,
    color: "#ff4444",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 2,
    borderColor: "#00ffcc",
    borderRadius: 10,
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    backgroundColor: "#1e1e1e",
  },
  resultArea: {
    alignItems: "center",
  },
  messageText: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 32,
  },
  button: {
    backgroundColor: "#00ffcc",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
  },
});
