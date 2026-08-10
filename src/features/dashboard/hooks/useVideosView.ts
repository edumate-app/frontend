import { useState } from 'react';
import type { VideosView } from '../components/videos-list';

const KEY = 'videos-view';

function readView(): VideosView {
  const saved = localStorage.getItem(KEY);
  return saved === 'grid' || saved === 'list' ? saved : 'list';
}

export function useVideosView() {
  const [view, setViewState] = useState<VideosView>(readView);

  const setView = (next: VideosView) => {
    setViewState(next);
    localStorage.setItem(KEY, next);
  };

  return { view, setView };
}
