<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Note;
use App\Models\Task;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $q = $request->string('q')->trim();

        if ($q->length() < 2) {
            return response()->json([]);
        }

        $term = "%{$q}%";

        $notes = Note::where('title', 'like', $term)
            ->orWhere('content', 'like', $term)
            ->limit(5)
            ->get(['id', 'title'])
            ->map(fn($note) => [
                'type'  => 'note',
                'id'    => $note->id,
                'title' => $note->title,
                'url'   => route('notes.index'),
            ]);

        $tasks = Task::where('title', 'like', $term)
            ->orWhere('description', 'like', $term)
            ->limit(5)
            ->get(['id', 'title', 'status'])
            ->map(fn($task) => [
                'type'   => 'task',
                'id'     => $task->id,
                'title'  => $task->title,
                'status' => $task->status,
                'url'    => route('tasks.index'),
            ]);

        $bookmarks = Bookmark::where('title', 'like', $term)
            ->orWhere('url', 'like', $term)
            ->orWhere('description', 'like', $term)
            ->limit(5)
            ->get(['id', 'title', 'url'])
            ->map(fn($bookmark) => [
                'type'     => 'bookmark',
                'id'       => $bookmark->id,
                'title'    => $bookmark->title,
                'subtitle' => $bookmark->url,
                'url'      => route('bookmarks.index'),
            ]);

        return response()->json([
            ...$notes->toArray(),
            ...$tasks->toArray(),
            ...$bookmarks->toArray(),
        ]);
    }
}
