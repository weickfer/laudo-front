import { useCallback, useState } from "react";
import { WatchedList } from "../lib/watched-list";

export function useWatchedList(initialItems, compareItems) {
  const [state, setState] = useState({
    currentItems: initialItems,
    new: [],
    removed: [],
    updated: [],
  })

  
  
  const watchedList = new WatchedList(initialItems, compareItems)
  watchedList.currentItems = state.currentItems
  watchedList.new = state.new;
  watchedList.removed = state.removed;
  watchedList.updated = state.updated;

  const updateState = useCallback(() => {
    setState({
      currentItems: watchedList.getItems(),
      new: watchedList.getNewItems(),
      removed: watchedList.getRemovedItems(),
      updated: watchedList.getUpdatedItems(),
    })
  }, [watchedList])

  const addItem = useCallback((item) => {
    watchedList.add(item)

    updateState()
  }, [watchedList, updateState])
  
  const removeItem = useCallback((item) => {
    watchedList.remove(item)

    updateState()
  }, [watchedList, updateState])
  
  const updateItem = useCallback((item, updatedItem) => {
    watchedList.update(item, updatedItem)

    updateState()
  }, [watchedList, updateState])

  const populate = useCallback((initialItems) => {
    setState(({
      currentItems: initialItems,
      new: [],
      removed: [],
      updated: [],
    }))
  })

  return {
    addItem,
    removeItem,
    updateItem,
    currentItems: state.currentItems,
    removedItems: state.removed,
    newItems: state.new,
    updatedItems: state.updated,
    populate,
  }
}