import { useState } from "react";

export function useAttachments() {
  const [attachments, setAttachments] = useState([]);
  const [currentAttachment, setCurrentAttachment] = useState(null)
  const [watched, setWatched] = useState({
    new: [],
    removed: [],
    updated: []
  })

  const selectAttachment = (attachment) => {
    setCurrentAttachment(attachment)
  }

  const deselectAttachment = () => {
    setCurrentAttachment(null)
  }

  const addAttachment = (newAttachment) => {
    if(Array.isArray(newAttachment)) {
      setAttachments(newAttachment)
      return 
    }

    setWatched(state => ({
      ...state,
      new: [...state.new, newAttachment]
    }))
    setAttachments((prev) => [...prev, newAttachment]);
  };

  const updateAttachment = (vectors, updatedImage) => {
    const attachmentId = currentAttachment.id

    const updatedAttachment = {
      id: attachmentId,
      vectors,
      url: currentAttachment.url,
      updatedImage,
    }

    setAttachments((prev) =>
      prev.map((attachment) =>
        attachment.id === attachmentId ? { ...attachment, vectors, updatedImage } : attachment
      )
    );
    setCurrentAttachment(null)

    const isNew = !!watched.new.find(item => item.id === attachmentId)

    if(isNew) {
      setWatched((state) => {
        const newList = state.new.map(item => item.id === attachmentId ? updatedAttachment : item)

        return {
          ...state,
          new: newList,
        }
      })
      return
    }

    setWatched((state) => {
      const updatedList = state.updated.some(item => item.id === attachmentId)
          ? state.updated.map(item => item.id === attachmentId ? updatedAttachment : item)
          : [...state.updated, updatedAttachment];

      return { ...state, updated: updatedList };
  });

  };

  const removeAttachment = ({ id, url }) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));

    const isNew = !!watched.new.find(item => item.id === id)

    if(isNew) {
      setWatched((state) => ({
        ...state,
        new: state.new.filter(item => item.id !== id),
      }))

      return
    }


    setWatched((state) => ({
      new: state.new.filter(item => item.id !== id),
      updated: state.updated.filter(item => item.id !== id),
      removed: [...state.removed, { id, url }]
    }))
  };

  const clear = () => {
    setAttachments([])
    setWatched({
      new: [],
      removed: [],
      updated: [],
    })
    setCurrentAttachment(null)
  }

  return {
    attachments,
    watched,
    addAttachment,
    updateAttachment,
    removeAttachment,
    clear,

    currentAttachment,
    selectAttachment,
    deselectAttachment,
  };
}
