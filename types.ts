export interface SectionData {
  id: string;
  title: string;
  backgroundText: string[];
  description: string[];
  videoPoster: string; // URL for the poster image
  videoUrl?: string;   // Optional real video URL
}

export interface WorkItem {
  id: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}
