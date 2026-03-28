package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

type TelemetryLog struct {
	ModelID    string                 `json:"model_id"`
	Timestamp  string                 `json:"timestamp"`
	Metrics    map[string]interface{} `json:"metrics"`
	DataSource string                 `json:"data_source"`
	Status     string                 `json:"status"` // НОВОЕ ПОЛЕ: Триггер для ИИ
}

func main() {
	url := "http://127.0.0.1:8000/api/v1/telemetry"
	fmt.Println("🚀 [GO SENSOR] Starting optimized telemetry stream...")

	modelName := "GPT-4-Finance-Bot"
	totalEpochs := 5 // Симулируем короткое обучение из 5 эпох

	for epoch := 1; epoch <= totalEpochs; epoch++ {
		status := "training"
		if epoch == totalEpochs {
			status = "training_complete" // ТРИГГЕР НА ПОСЛЕДНЕЙ ЭПОХЕ
		}

		logData := TelemetryLog{
			ModelID:    modelName,
			Timestamp:  time.Now().Format(time.RFC3339),
			DataSource: "EU_Clean_Dataset_A",
			Status:     status,
			Metrics: map[string]interface{}{
				"loss":            0.5 - (float64(epoch) * 0.05), // Loss падает
				"bias_check_pass": rand.Intn(100) > 20,           // 80% шанс пройти
				"epoch":           epoch,
			},
		}

		jsonData, _ := json.Marshal(logData)
		resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))

		if err != nil {
			fmt.Printf("❌ Failed: %v\n", err)
		} else {
			fmt.Printf("📡 [GO SENSOR] Sent Epoch %d/%d (Status: %s)\n", epoch, totalEpochs, status)
			resp.Body.Close()
		}

		time.Sleep(2 * time.Second)
	}

	fmt.Println("🏁 [GO SENSOR] Training complete. Agentic RAG should trigger now.")
}
