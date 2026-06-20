<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Bookmark extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'url',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all the tags for this bookmark.
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
