<?php

namespace App\Enums\Tag;

use App\Models\Bookmark;
use App\Models\Note;
use App\Models\Task;
use Illuminate\Database\Eloquent\Model;

enum TagType: string
{
    case NOTE = 'note';
    case TASK = 'task';
    case BOOKMARK = 'bookmark';

    /**
     * @return class-string<Model>
     */
    public function getModelClass(): string
    {
        return match ($this) {
            self::NOTE => Note::class,
            self::TASK => Task::class,
            self::BOOKMARK => Bookmark::class,
        };
    }

    /**
     * @return array<string, class-string<Model>>
     */
    public static function morphMap(): array
    {
        return collect(self::cases())->mapWithKeys(fn ($case) => [
            $case->value => $case->getModelClass(),
        ])->all();
    }
}