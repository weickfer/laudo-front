import { Plus } from "lucide-react"
import React, { useState } from "react"
import { Label } from "./ui/label"

import { useParams } from "react-router"
import { dataURLtoFile } from "../lib/base64-to-file"
import { Attachment } from "../modules/annotations/components/annotation-form/attachment"
import { MapControl, MapProvider, OlMap } from '../modules/gis-viewer'
import { api } from "../services/api"

export function LocalizationStep({ formData, updateFormData }) {
  const { id: reportId } = useParams()
  const [geolocations, setGeolocations] = useState(formData?.geolocations ?? [])
  // const [locationsImage, setLocationsImage] = useState(formData?.locationsImage ?? [])
  const [step, setStep] = useState('form')
  const [pdfFile, setPdfFile] = useState(formData?.pdf ?? null)
  const mapIsOpen = step === 'map'

  const hasEditMode = !!formData?.id
  const pdfName = (hasEditMode && formData?.pdfUrl) ? decodeURIComponent(formData.pdfUrl.split('/').pop()) : null

  const handleOpenMap = () => {
    setStep('map')
  }

  const handleAddGeolocation = async ({ imageUrl, coords }) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const newGeolocation = {
      id,
      latitude: coords.latitude,
      longitude: coords.longitude,
      imagemNome: id,
      url: imageUrl
    }
    const updatedGeolocations = [...geolocations, newGeolocation]
    setGeolocations(updatedGeolocations)
    setStep('form')
    updateFormData({ geolocations: updatedGeolocations })

    const file = dataURLtoFile(imageUrl, id)
    const response = await api(`/api/v2/relatorios/${reportId}/geolocation/signed-url`, 'POST', {
      latitude: newGeolocation.latitude,
      longitude: newGeolocation.longitude,
      imagemNome: file.name,
    })

    if (response) {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = function (event) {
        const percent = (event.loaded / event.total) * 100;
        console.log(`Progresso: ${percent.toFixed(2)}%`);
      };

      xhr.open("PUT", response.signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    }
  }

  // const handleAddLocationImage = (e) => {
  //   const file = e?.target?.files?.[0]

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
  //       const updatedLocationsImage = [...locationsImage, {
  //         id,
  //         imagemNome: file.name,
  //         url: e.target.result
  //       }]
  //       setLocationsImage(updatedLocationsImage)
  //       updateFormData({ locationsImage: updatedLocationsImage })
  //     };
  //     reader.readAsDataURL(file);
  //     return
  //   }
  // }

  const handlePDFChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      console.log("Arquivo PDF carregado:", file.name);
      updateFormData({ pdf: file, pdfNome: file.name })

      const response = await api(`/api/v2/relatorios/${reportId}/pdf/signed-url`, 'POST', {
        pdfNome: file.name,
      })
  
      if (response) {
        const xhr = new XMLHttpRequest();
  
        xhr.upload.onprogress = function (event) {
          const percent = (event.loaded / event.total) * 100;
          console.log(`Progresso: ${percent.toFixed(2)}%`);
        };
  
        xhr.open("PUT", response.signedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      }
    } else {
      setPdfFile(null);
      alert("Por favor, envie apenas arquivos PDF.");
    }
  };

  return (
    <>
      <MapProvider>
        <div data-open={mapIsOpen} className={`relative w-full h-[34rem] overflow-x-hidden hidden data-[open=true]:block`}>
          <OlMap />


          <div className="absolute flex flex-row left-[50%] -translate-x-[70%] bottom-0 pb-4 z-30">
            <MapControl enabledTools={["Point", "LineString", "Polygon", "Camera"]} onCapture={handleAddGeolocation} />
            {/* <CaptureImage onClick={handleAddGeolocation} /> */}
          </div>
        </div>
        {
          !mapIsOpen && (
            <div className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="location">Localização geográfica</Label>
                  <div className="flex gap-2">
                    {
                      geolocations.map(location => (
                        <Attachment
                          key={location.id}
                          onRemove={() => {
                            const updated = geolocations.filter(item => item.id !== location.id)
                            setGeolocations(updated)
                            updateFormData({ geolocations: updated })
                          }}
                          url={location.url}
                        />
                      ))
                    }
                    <button onClick={handleOpenMap} className="flex items-center justify-center size-14 rounded-sm border border-gray-300 text-gray-300 cursor-pointer">
                      <Plus className="size-10" />
                    </button>
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
                    {(pdfFile || pdfName) && (
                      <p className="text-sm text-green-600">
                        Arquivo selecionado: <span className="font-medium">{pdfFile?.name ?? pdfName}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </MapProvider>

    </>

  )
}
