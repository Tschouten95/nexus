<?php

namespace Database\Factories;

use App\Enums\Task\TaskPriority;
use App\Enums\Task\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(TaskStatus::cases())->value,
            'priority' => $this->faker->randomElement(TaskPriority::cases())->value,
            'position' => 0,
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}