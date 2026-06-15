<?php

namespace App\Http\Controllers;

use App\Enums\Task\TaskStatus;
use App\Models\Bookmark;
use App\Models\Note;
use App\Models\Task;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $weekAgo = now()->subWeek();

        $openTasks = Task::query()->where('status', '!=', TaskStatus::DONE->value);

        $recentNotes = Note::query()
            ->latest('updated_at')
            ->take(3)
            ->get(['id', 'title', 'content', 'updated_at'])
            ->map(fn (Note $note) => [
                'id'         => $note->id,
                'title'      => $note->title,
                'updated_at' => $note->updated_at->toIso8601String(),
                'word_count' => str_word_count(strip_tags($note->content ?? '')),
            ]);

        $upNext = Task::query()
            ->where('status', '!=', TaskStatus::DONE->value)
            ->orderByRaw('due_date is null, due_date asc')
            ->orderByRaw("field(priority, 'high', 'medium', 'low')")
            ->take(3)
            ->get(['id', 'title', 'status', 'priority', 'due_date'])
            ->map(fn (Task $task) => [
                'id'       => $task->id,
                'title'    => $task->title,
                'status'   => $task->status->value,
                'priority' => $task->priority->value,
                'due_date' => $task->due_date?->toIso8601String(),
            ]);

        $savedLately = Bookmark::query()
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'url']);

        return Inertia::render('dashboard', [
            'stats' => [
                'notes'         => Note::count(),
                'notesWeek'     => Note::where('created_at', '>=', $weekAgo)->count(),
                'tasksOpen'     => (clone $openTasks)->count(),
                'tasksDueToday' => (clone $openTasks)->whereDate('due_date', today())->count(),
                'tasksWeek'     => Task::where('created_at', '>=', $weekAgo)->count(),
                'bookmarks'     => Bookmark::count(),
                'bookmarksWeek' => Bookmark::where('created_at', '>=', $weekAgo)->count(),
            ],
            'recentNotes' => $recentNotes,
            'upNext'      => $upNext,
            'savedLately' => $savedLately,
            'graph'       => $this->buildGraph(),
        ]);
    }

    /**
     * Build the "Your nexus" graph: a central hub node connected to recent
     * items of each type, plus cross-links between items whose titles share
     * a meaningful keyword.
     */
    private function buildGraph(): array
    {
        $items = collect();

        Note::query()->latest('updated_at')->take(5)->get(['id', 'title'])
            ->each(fn (Note $n) => $items->push(['id' => "note-{$n->id}", 'type' => 'note', 'title' => $n->title]));

        Task::query()->where('status', '!=', TaskStatus::DONE->value)->latest()->take(4)->get(['id', 'title'])
            ->each(fn (Task $t) => $items->push(['id' => "task-{$t->id}", 'type' => 'task', 'title' => $t->title]));

        Bookmark::query()->latest()->take(4)->get(['id', 'title'])
            ->each(fn (Bookmark $b) => $items->push(['id' => "bookmark-{$b->id}", 'type' => 'bookmark', 'title' => $b->title]));

        $nodes = [['id' => 'hub', 'type' => 'hub', 'label' => '']];
        $links = [];

        foreach ($items as $item) {
            $nodes[] = [
                'id'    => $item['id'],
                'type'  => $item['type'],
                'label' => $this->shortLabel($item['title']),
            ];
            $links[] = ['source' => 'hub', 'target' => $item['id']];
        }

        // Cross-links: connect any two items sharing a keyword of length >= 4.
        $tokens = $items->map(fn ($item) => $this->keywords($item['title']))->all();
        $values = $items->values();

        for ($i = 0; $i < $values->count(); $i++) {
            for ($j = $i + 1; $j < $values->count(); $j++) {
                if (array_intersect($tokens[$i], $tokens[$j])) {
                    $links[] = ['source' => $values[$i]['id'], 'target' => $values[$j]['id']];
                }
            }
        }

        return ['nodes' => $nodes, 'links' => $links];
    }

    private function shortLabel(string $title): string
    {
        $words = preg_split('/\s+/', trim($title));
        $label = implode(' ', array_slice($words, 0, 2));

        return strlen($label) > 16 ? substr($label, 0, 15).'…' : $label;
    }

    /**
     * @return array<int, string>
     */
    private function keywords(string $title): array
    {
        return collect(preg_split('/[^a-z0-9]+/i', strtolower($title)))
            ->filter(fn ($w) => strlen($w) >= 4)
            ->unique()
            ->values()
            ->all();
    }
}
