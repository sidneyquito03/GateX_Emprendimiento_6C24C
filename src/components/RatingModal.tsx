import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  eventName: string;
  onSubmit: (rating: number, comment: string) => void;
}

export const RatingModal = ({
  open,
  onClose,
  eventName,
  onSubmit,
}: RatingModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    reset();
  };

  const reset = () => {
    setRating(0);
    setComment("");
    setHoveredRating(0);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
        reset();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calificar Evento</DialogTitle>
          <DialogDescription>
            Comparte tu opinión sobre {eventName}
          </DialogDescription>
        </DialogHeader>

        {/* Star Rating */}
        <div className="flex flex-col items-center py-4">
          <div className="flex space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-all`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating === 1 && "Malo"}
            {rating === 2 && "Regular"}
            {rating === 3 && "Bueno"}
            {rating === 4 && "Muy bueno"}
            {rating === 5 && "Excelente"}
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Comentario (opcional)</label>
          <Textarea
            placeholder="Comparte tu experiencia en el evento..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
            rows={4}
          />
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0}
            variant="default"
          >
            Enviar Calificación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};