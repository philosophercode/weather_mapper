import { useState } from 'react';
import { useUpdateSpot } from '@/hooks/useSpots';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';

interface NotesEditorProps {
  spotId: string;
  initialNotes: string | null;
}

export default function NotesEditor({ spotId, initialNotes }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes || '');
  const updateSpot = useUpdateSpot();

  const handleSave = async () => {
    try {
      await updateSpot.mutateAsync({
        id: spotId,
        input: { notes: notes || null },
      });
    } catch (error) {
      console.error('Failed to update notes:', error);
      alert('Failed to save notes. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this city..."
          rows={4}
        />
        <Button onClick={handleSave} disabled={updateSpot.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateSpot.isPending ? 'Saving...' : 'Save Notes'}
        </Button>
      </CardContent>
    </Card>
  );
}

