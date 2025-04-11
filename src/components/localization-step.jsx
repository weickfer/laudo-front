import { Plus } from "lucide-react"
import React, { useState } from "react"
import { Label } from "./ui/label"

import { AttachmentInput } from "../../modules/annotations/components/annotation-form/atachment-input"
import { Attachment } from "../../modules/annotations/components/annotation-form/attachment"
import { CaptureImage, MapControl, MapProvider, OlMap } from '../../modules/gis-viewer'

export function LocalizationStep({ formData, updateFormData }) {
  const [geolocations, setGeolocations] = useState(formData?.geolocations ?? [])
  const [locationsImage, setLocationsImage] = useState(formData?.locationsImage ?? [])
  const [step, setStep] = useState('form')
  const [pdfFile, setPdfFile] = useState(formData?.pdf ?? null)
  const mapIsOpen = step === 'map'

  const handleOpenMap = () => {
    setStep('map')
  }

  const handleAddGeolocation = ({ imageUrl, coords }) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const updatedGeolocations = [...geolocations, { id, imageUrl, coords }]
    setGeolocations(updatedGeolocations)
    setStep('form')
    updateFormData({ geolocations: updatedGeolocations })
  }

  const handleAddLocationImage = (e) => {
    const file = e?.target?.files?.[0]

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        const updatedLocationsImage = [...locationsImage, {
          id,
          imageUrl: e.target.result,
        }]
        setLocationsImage(updatedLocationsImage)
        updateFormData({ locationsImage: updatedLocationsImage })
        // setAttachments([...attachments, { id, url: e.target.result, vectors: [] }])
      };
      reader.readAsDataURL(file);

      return
    }
    // setLocationsImage(state => [...state, { imageUrl, coords }])
    // setStep('form')
  }

  const handlePDFChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      console.log("Arquivo PDF carregado:", file.name);
      updateFormData({ pdf: file })
    } else {
      setPdfFile(null);
      alert("Por favor, envie apenas arquivos PDF.");
    }
  };

  return (
    <>
      {
        mapIsOpen ? (
          <MapProvider>
            <div className="relative w-full h-[34rem] overflow-x-hidden">
              <OlMap />


              <div className="absolute flex flex-row left-[50%] -translate-x-[70%] bottom-0 pb-4 z-30">
                <MapControl />
                <CaptureImage onClick={handleAddGeolocation} />
              </div>
            </div>
          </MapProvider>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="location">Localização geográfica</Label>
                <div className="flex gap-2">
                  {
                    geolocations.map(location => (
                      <Attachment
                        onRemove={() => setGeolocations(state => state.filter(item => item.id !== location.id))}
                        url={location.imageUrl}
                      />
                    ))
                  }
                  <button onClick={handleOpenMap} className="flex items-center justify-center size-14 rounded-sm border border-gray-300 text-gray-300 cursor-pointer">
                    <Plus className="size-10" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="location">Localização em rua</Label>
                <div className="flex gap-2">
                  {
                    locationsImage.map(location => (
                      <Attachment
                        onRemove={() => setLocationsImage(state => state.filter(item => item.id !== location.id))}
                        url={location.imageUrl}
                      />
                    ))
                  }
                  <AttachmentInput onAddAttachment={handleAddLocationImage} />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="pdf-upload">Plantas</Label>

                <div className="grid gap-3">
                  <input
                    type="file"
                    id="pdf-upload"
                    accept="application/pdf"
                    onChange={handlePDFChange}
                    className="block w-full text-sm text-gray-700
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-gray-100 file:text-gray-700
                   hover:file:bg-gray-200
                   cursor-pointer"
                  />
                  {pdfFile && (
                    <p className="text-sm text-green-600">
                      Arquivo selecionado: <span className="font-medium">{pdfFile.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}
