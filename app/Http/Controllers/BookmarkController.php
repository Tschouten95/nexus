<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    public function index()
    {
        $bookmarks = Bookmark::orderByDesc('created_at')->get();

        return Inertia::render('bookmarks/index', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'url'         => ['required', 'url', 'max:2048'],
            'description' => ['nullable', 'string'],
        ]);

        Bookmark::create([...$validated, 'user_id' => $request->user()->id]);

        return redirect()->route('bookmarks.index');
    }

    public function update(Request $request, Bookmark $bookmark)
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'url'         => ['required', 'url', 'max:2048'],
            'description' => ['nullable', 'string'],
        ]);

        $bookmark->update($validated);

        return redirect()->route('bookmarks.index');
    }

    public function destroy(Bookmark $bookmark)
    {
        $bookmark->delete();

        return redirect()->route('bookmarks.index');
    }
}
