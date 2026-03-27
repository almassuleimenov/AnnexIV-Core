package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

// Структура должна точно совпадать с Pydantic схемой в FastAPI
type TelemetryLog struct {
	ModelID    string                 `json:"model_id"`
	Timestamp  string                 `json:"timestamp"`
	Metrics    map[string]interface{} `json:"metrics"`
	DataSource string                 `json:"data_source"`
}

func main() {
	url := "http://127.0.0.1:8000/api/v1/telemetry"
	fmt.Println("🚀 [GO SENSOR] Starting telemetry stream to AnnexIV.ai Core...")

	models := []string{"GPT-4-Turbo", "Llama-3-70B", "Mistral-Large", "Vision-Model-v2"}

	for {
		// Генерируем фейковые данные обучения
		logData := TelemetryLog{
			ModelID:    models[rand.Intn(len(models))],
			Timestamp:  time.Now().Format(time.RFC3339),
			DataSource: "EU_Clean_Dataset_A",
			Metrics: map[string]interface{}{
				"loss":            rand.Float64() * 0.5,
				"bias_check_pass": rand.Intn(100) > 10, // 90% шанс пройти проверку на bias
				"epoch":           rand.Intn(100),
			},
		}

		// Превращаем в JSON
		jsonData, err := json.Marshal(logData)
		if err != nil {
			fmt.Println("Error marshaling JSON:", err)
			continue
		}

		// Отправляем POST запрос
		resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Printf("❌ [GO SENSOR] Failed to send data: %v\n", err)
		} else {
			fmt.Printf("✅ [GO SENSOR] Sent logs for %s (Status: %d)\n", logData.ModelID, resp.StatusCode)
			resp.Body.Close()
		}

		// Спим 3 секунды перед следующей отправкой
		time.Sleep(3 * time.Second)
	}
}