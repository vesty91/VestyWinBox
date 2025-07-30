import { logger } from './LoggerService';

export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  error?: string;
  fileSize?: number;
}

export interface ConversionOptions {
  quality?: number;
  resize?: {
    enabled: boolean;
    maxWidth: number;
    maxHeight: number;
  };
}

export class FileConversionService {
  private static instance: FileConversionService;
  private outputDirectory: string = '';

  private constructor() {
    // Initialiser le dossier de sortie
    this.initializeOutputDirectory();
  }

  public static getInstance(): FileConversionService {
    if (!FileConversionService.instance) {
      FileConversionService.instance = new FileConversionService();
    }
    return FileConversionService.instance;
  }

  private async initializeOutputDirectory(): Promise<void> {
    try {
      // Utiliser le dossier Documents/VestyWinBox/Conversions
      const documentsPath = await this.getDocumentsPath();
      this.outputDirectory = `${documentsPath}/VestyWinBox/Conversions`;
      
      // Créer le dossier s'il n'existe pas
      await this.ensureDirectoryExists(this.outputDirectory);
      
      logger.info(`Dossier de conversions initialisé: ${this.outputDirectory}`, null, 'FILE_CONVERSION');
    } catch (error) {
      logger.error(`Erreur lors de l'initialisation du dossier: ${error}`, null, 'FILE_CONVERSION');
      // Fallback vers le dossier temporaire
      this.outputDirectory = await this.getTempPath();
    }
  }

  private async getDocumentsPath(): Promise<string> {
    // Dans un environnement Electron, on utiliserait electron.remote
    // Pour l'instant, on simule
    return process.env.USERPROFILE ? `${process.env.USERPROFILE}/Documents` : './conversions';
  }

  private async getTempPath(): Promise<string> {
    return process.env.TEMP || './temp';
  }

  private async ensureDirectoryExists(path: string): Promise<void> {
    // Simulation - dans Electron on utiliserait fs.mkdir
    console.log(`Création du dossier: ${path}`);
  }

  public async convertFile(
    inputFile: File, 
    targetFormat: string, 
    options?: ConversionOptions
  ): Promise<ConversionResult> {
    try {
      logger.info(`Début de conversion: ${inputFile.name} -> ${targetFormat}`, {
        size: inputFile.size,
        type: inputFile.type
      }, 'FILE_CONVERSION');

      // Simuler le temps de conversion
      await this.simulateConversion(inputFile.size);

      // Générer le nom du fichier de sortie
      const outputFileName = this.generateOutputFileName(inputFile.name, targetFormat);
      const outputPath = `${this.outputDirectory}/${outputFileName}`;

      // Créer le contenu converti
      const convertedContent = await this.createConvertedContent(inputFile, targetFormat, options);

      // Simuler la sauvegarde
      await this.saveFile(outputPath, convertedContent);

      const result: ConversionResult = {
        success: true,
        outputPath,
        fileSize: convertedContent.length
      };

      logger.info(`Conversion réussie: ${outputPath}`, {
        originalSize: inputFile.size,
        convertedSize: convertedContent.length
      }, 'FILE_CONVERSION');

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`Erreur de conversion: ${errorMessage}`, null, 'FILE_CONVERSION');
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private async simulateConversion(fileSize: number): Promise<void> {
    // Simuler le temps de conversion basé sur la taille du fichier
    const baseTime = 1000; // 1 seconde de base
    const sizeFactor = Math.min(fileSize / 1024 / 1024, 10); // Max 10 secondes
    const conversionTime = baseTime + (sizeFactor * 1000);
    
    await new Promise(resolve => setTimeout(resolve, conversionTime));
  }

  private generateOutputFileName(originalName: string, targetFormat: string): string {
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `converted_${baseName}_${timestamp}.${targetFormat}`;
  }

  private async createConvertedContent(
    inputFile: File, 
    targetFormat: string, 
    options?: ConversionOptions
  ): Promise<string> {
    // Vérifier si c'est une image
    if (this.isImageFile(inputFile)) {
      return await this.convertImage(inputFile, targetFormat, options);
    }
    
    // Pour les fichiers texte, utiliser la méthode existante
    const fileContent = await this.readFileContent(inputFile);

    // Convertir selon le format cible
    switch (targetFormat) {
      case 'txt':
        return this.convertToText(fileContent, inputFile.name);
      
      case 'md':
        return this.convertToMarkdown(fileContent, inputFile.name);
      
      case 'json':
        return this.convertToJson(fileContent, inputFile.name);
      
      case 'html':
        return this.convertToHtml(fileContent, inputFile.name);
      
      case 'csv':
        return this.convertToCsv(fileContent, inputFile.name);
      
      default:
        return `Fichier converti: ${inputFile.name} -> ${targetFormat}\n\nContenu original:\n${fileContent}`;
    }
  }

  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/') || 
           /\.(png|jpg|jpeg|gif|bmp|webp|ico|svg)$/i.test(file.name);
  }

  private async convertImage(
    inputFile: File, 
    targetFormat: string, 
    options?: ConversionOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Impossible de créer le contexte Canvas'));
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        try {
          // Définir la taille du canvas
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Dessiner l'image sur le canvas
          ctx.drawImage(img, 0, 0);
          
          // Convertir selon le format cible
          let mimeType = 'image/png';
          let quality = 0.9;
          
          switch (targetFormat) {
            case 'jpg':
            case 'jpeg':
              mimeType = 'image/jpeg';
              quality = options?.quality ? options.quality / 100 : 0.9;
              break;
            case 'png':
              mimeType = 'image/png';
              break;
            case 'webp':
              mimeType = 'image/webp';
              quality = options?.quality ? options.quality / 100 : 0.9;
              break;
            case 'gif':
              mimeType = 'image/gif';
              break;
            case 'bmp':
              mimeType = 'image/bmp';
              break;
            default:
              mimeType = 'image/png';
          }
          
          // Convertir le canvas en blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Convertir le blob en base64 pour le stockage
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result as string;
                resolve(base64);
              };
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Impossible de convertir l\'image'));
            }
          }, mimeType, quality);
          
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image'));
      };
      
      // Charger l'image
      const url = URL.createObjectURL(inputFile);
      img.src = url;
      
      // Nettoyer l'URL après chargement
      img.onload = () => {
        URL.revokeObjectURL(url);
      };
    });
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private convertToText(content: string, fileName: string): string {
    return `Fichier converti: ${fileName}
Date de conversion: ${new Date().toLocaleString()}
Format: Texte brut

${content}`;
  }

  private convertToMarkdown(content: string, fileName: string): string {
    return `# Fichier converti: ${fileName}

**Date de conversion:** ${new Date().toLocaleString()}
**Format:** Markdown

## Contenu

\`\`\`
${content}
\`\`\``;
  }

  private convertToJson(content: string, fileName: string): string {
    return JSON.stringify({
      metadata: {
        originalFile: fileName,
        conversionDate: new Date().toISOString(),
        format: 'json'
      },
      content: content,
      stats: {
        length: content.length,
        lines: content.split('\n').length
      }
    }, null, 2);
  }

  private convertToHtml(content: string, fileName: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fichier converti - ${fileName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .content { margin-top: 20px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 3px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Fichier converti: ${fileName}</h1>
        <p><strong>Date de conversion:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Format:</strong> HTML</p>
    </div>
    <div class="content">
        <h2>Contenu</h2>
        <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </div>
</body>
</html>`;
  }

  private convertToCsv(content: string, fileName: string): string {
    // Convertir le contenu en CSV basique
    const lines = content.split('\n');
    const csvLines = lines.map(line => {
      // Échapper les virgules et guillemets
      const escaped = line.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    
    return `"Fichier","${fileName}"
"Date de conversion","${new Date().toLocaleString()}"
"Format","CSV"
""
${csvLines.join('\n')}`;
  }

  private async saveFile(path: string, content: string): Promise<void> {
    // Simulation de sauvegarde
    console.log(`Sauvegarde du fichier: ${path}`);
    console.log(`Taille: ${content.length} caractères`);
    
    // Dans Electron, on utiliserait fs.writeFile
    // await fs.writeFile(path, content, 'utf8');
  }

  public getOutputDirectory(): string {
    return this.outputDirectory;
  }

  public async openOutputDirectory(): Promise<void> {
    try {
      // Dans Electron, on utiliserait shell.openPath
      // await shell.openPath(this.outputDirectory);
      console.log(`Ouverture du dossier: ${this.outputDirectory}`);
    } catch (error) {
      logger.error(`Erreur lors de l'ouverture du dossier: ${error}`, null, 'FILE_CONVERSION');
    }
  }
} 