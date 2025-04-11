import { useMap } from "../contexts/map-context"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"


function Point({ points }) {
  const [latitude, longitude] = points[0]

  return (
    <>
      <Input disabled placeholder={`Latitude | ${latitude}`} />
      <Input disabled placeholder={`Longitude | ${longitude}`} />
    </>
  )
}

function LineString({ points }) {
  const [latitudeStart, longitudeStart] = points[0]
  const [latitudeEnd, longitudeEnd] = points[1]

  return (
    <>
      <Label>Início</Label>
      <Input disabled placeholder={`Latitude | ${latitudeStart}`} />
      <Input disabled placeholder={`Longitude | ${longitudeStart}`} />
      <Label>Fim</Label>
      <Input disabled placeholder={`Latitude | ${latitudeEnd}`} />
      <Input disabled placeholder={`Longitude | ${longitudeEnd}`} />
    </>
  )
}

const drawLabelMapper = {
  Rectangle: "Retângulo",
  Measure: "Medir",
  Point: "Ponto",
  LineString: "Linha",
  Polygon: "Polígono",
}


export function FeatureDialog() {
  const { 
    dialogOpen,
    handleDialogClose,
    currentPoints: points,
    drawType
  } = useMap()
  const drawLabel = drawLabelMapper[drawType || 'Point']

  return (
    <Dialog open={dialogOpen} onOpenChange={value => value === false && handleDialogClose(false)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Adicionar empreendimento</DialogTitle>
          <DialogDescription>
            Insira os dados do empreendimento abaixo. Por favor, preencha todas as informações necessárias:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row gap-10">
          <div className="flex w-[340px] flex-col gap-4">
            <Label>Dados Gerais</Label>
            <Input placeholder="Nome do projeto" />
            <Input placeholder="Fase" />
            <Input placeholder="Unidade" />
            <Textarea placeholder="Descrição" />
          </div>



          <div className="flex flex-col gap-4">
            <Label>{drawLabel}</Label>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Vertices</th>
                  <th>X</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{point[0]}</td>
                    <td>{point[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="destructive" onClick={() => handleDialogClose(false)}>Cancelar</Button>
          <Button onClick={() => handleDialogClose(true)}>Inserir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    maxWidth: "500px",
    width: "80%",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginBottom: "20px",
    borderCollapse: "collapse",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};