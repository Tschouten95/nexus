<?php

namespace App\Models;

use App\Enums\Tag\TagType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'type' => TagType::class
        ];
    }

    /**
     * Get all of the notes that are assigned this tag.
     */
    public function notes(): MorphToMany
    {
        return $this->morphedByMany(Note::class, 'taggable');
    }

    /**
     * Get all of the tasks that are assigned this tag.
     */
    public function tasks(): MorphToMany
    {
        return $this->morphedByMany(Task::class, 'taggable');
    }

    /**
     * Get all of the bookmarks that are assigned this tag.
     */
    public function bookmarks(): MorphToMany
    {
        return $this->morphedByMany(Bookmark::class, 'taggable');
    }
}
