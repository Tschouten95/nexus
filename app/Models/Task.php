<?php

namespace App\Models;

use App\Enums\Task\TaskPriority;
use App\Enums\Task\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;


class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'priority',
        'position',
        'due_date',
    ];

    protected $casts = [
        'status' => TaskStatus::class,
        'priority' => TaskPriority::class,
        'due_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all the tags for this task.
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
