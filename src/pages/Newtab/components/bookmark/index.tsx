import Window from '@/components/common/window';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';
import storage from '@/lib/storage';
import React from 'react';
import NotionBookmark from './notion-bookmark';
import UrlItem from './url-item';

const Bookmark = () => {
  const [folders, setFolders] = React.useState<any[]>([]);
  const [state, setState] = React.useState<any>();
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  React.useEffect(() => {
    const getTree = () => {
      let scanTree = (bookmarks: any[]) => {
        bookmarks.forEach((bookmark) => {
          if (bookmark.children) {
            let fid = folders.findIndex((i) => i.id === bookmark.id);
            if (fid === -1) {
              setFolders((prev) => [
                ...prev,
                {
                  id: bookmark.id,
                  title: bookmark.title,
                  show: true,
                  sites: [],
                },
              ]);
            }
            scanTree(bookmark.children);
          } else {
            setFolders((prev) =>
              prev.map((f) => {
                if (f.id === bookmark.parentId) {
                  return {
                    ...f,
                    sites: [...f.sites, bookmark],
                  };
                }
                return f;
              })
            );
          }
        });
      };

      chrome.bookmarks?.getTree((bookmarks) => {
        scanTree(bookmarks);

        chrome.topSites.get((results) => {
          setFolders((prev) =>
            [
              {
                id: 100,
                title: 'Top Sites',
                show: true,
                sites: results,
              },
              ...prev,
            ].filter((f) => f.sites.length)
          );
        });
      });
    };

    getTree();

    const state = storage.getLocalStorage(storage.KEYS.bookmarkWindowRndState);
    if (state) {
      setState(state);
    } else {
      setState({
        x: 5,
        y: 5,
        width: 750,
        height: 340,
      });
    }
  }, []);

  const handleChangeState = (state: any) => {
    storage.setLocalStorage(storage.KEYS.bookmarkWindowRndState, state);
  };

  const handleToggleFullScreen = (isFullScreen: boolean) => {
    setIsFullScreen(isFullScreen);
  };

  if (!state) {
    return null;
  }

  return (
    <Window
      {...state}
      onChangeState={handleChangeState}
      onToggleFullScreen={handleToggleFullScreen}
    >
      <CardContent className="pt-2 h-full overflow-y-auto">
        <div>
          {folders.map((folder) => {
            return (
              <div key={folder.id} className="mb-2">
                <div className="text-gray-700 dark:text-gray-200 font-bold mb-2">
                  {folder.title}
                </div>
                <div className="flex gap-1">
                  {folder.sites.map((site: any) => {
                    return (
                      <UrlItem
                        key={site.url}
                        url={site.url}
                        title={site.title}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {isFullScreen && <NotionBookmark />}
      </CardContent>
    </Window>
  );
};

export default Bookmark;
