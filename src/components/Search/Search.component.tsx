import React from "react";

import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { FolderIcon } from "@heroicons/react/24/outline";
import useSpotify from "~/hooks/useSpotify.hook";
import debounce from "lodash.debounce";
import Image from "next/future/image";

import styles from "./Search.module.css";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type Playlist = Partial<SpotifyApi.PlaylistBaseObject>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const Search: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = React.useState("");

  const [result, setResult] = React.useState<Playlist[]>([]);

  const { ready, client } = useSpotify();

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  React.useEffect(() => {
    if (!query) return setQuery("");
    if (!ready) return;
    client.searchPlaylists(query, { limit: 8 }).then(
      (data: any) => {
        if (!data.body) return setResult([]);
        setResult(data.body.playlists?.items);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }, [client, query, ready]);

  return (
    <Transition.Root
      show={open}
      as={React.Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className={styles.dialog} onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 "
          leaveTo="opacity-0"
        >
          <div className={styles.background} />
        </Transition.Child>

        <div className={styles.wrapper}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className={styles.panel}>
              <Combobox
                onChange={(item: Playlist) => handleSelect(item.id || "")}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className={styles.icon}
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className={styles.input}
                    autoComplete="off"
                    placeholder="Szukaj..."
                    onChange={debounce(handleOnChange, 300)}
                  />
                </div>

                {result.length > 0 && (
                  <Combobox.Options static className={styles.combobox}>
                    <li className={styles.comboboxList}>
                      {result.length > 0 && (
                        <h2 className={styles.comboboxHeader}>
                          Wyniki wyszukiwania
                        </h2>
                      )}
                      <ul className={styles.comboboxListElement}>
                        {result.map((playlist) => (
                          <Combobox.Option
                            key={playlist.id}
                            value={playlist}
                            className={({ active }) =>
                              classNames(
                                "flex cursor-pointer select-none items-center rounded-md px-3 py-2",
                                active && "bg-opacity-5 text-tex"
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                {playlist.images?.[0]?.url ? (
                                  <Image
                                    className={styles.image}
                                    src={playlist.images[0].url}
                                    alt=""
                                    width={40}
                                    height={40}
                                    loading="eager"
                                  />
                                ) : (
                                  <span
                                    className={`${styles.image} ${styles.placeholder}`}
                                  />
                                )}
                                <span className={styles.comboboxName}>
                                  {playlist.name}
                                </span>
                                {active && (
                                  <span className={styles.comboboxActive}>
                                    Wybierz...
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </ul>
                    </li>
                  </Combobox.Options>
                )}

                {query !== "" && result.length === 0 && (
                  <div className={styles.emptyContainer}>
                    <FolderIcon
                      className={styles.emptyIcon}
                      aria-hidden="true"
                    />
                    <p className={styles.emptyDescription}>
                      Nie udało się nic znaleźć. Spróbuj ponownie.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Search;
