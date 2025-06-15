/**
 * Service to interact with EVE Online ESI (EVE Swagger Interface) API
 * Primarily handles image server interactions initially
 * https://developers.eveonline.com/docs/services/image-server/
 */

// Import the type-to-image mapping
import typeImageMap from '../scripts/type-image-map.json';

/**
 * Interface for the image mapping structure
 */
interface ImageMapping {
  [typeId: string]: string[];
}

/**
 * Types of images available from the EVE Image Server
 */
export enum ImageCategory {
  Alliance = 'alliances',
  Character = 'characters',
  Corporation = 'corporations',
  InventoryType = 'types', // Used for items, ships, etc.
}

/**
 * Size options for images (in pixels)
 * Not all sizes are available for all image categories
 */
export enum ImageSize {
  // General sizes
  Tiny = 32,
  Small = 64,
  Medium = 128,
  Large = 256,
  XLarge = 512,
  XXLarge = 1024,
  
  // Special sizes for renders
  RenderSmall = 32,
  RenderMedium = 64, 
  RenderLarge = 128,
  RenderXLarge = 256,
  RenderXXLarge = 512,
}

/**
 * Image variations available from EVE Image Server
 */
export enum ImageVariation {
  // Common variations
  Default = '',
  
  // Character variations
  Portrait = 'portrait',
  
  // Corporation and Alliance variations
  Logo = 'logo',
  
  // Type variations
  Icon = 'icon',
  Render = 'render',
  BPO = 'bp',       // Blueprint Original
  BPC = 'bpc',      // Blueprint Copy
  Relic = 'relic'
}

interface ImageOptions {
  /**
   * Optional size for the image (powers of two between 32 and 1024)
   * If not specified, default/original size will be used
   */
  size?: ImageSize;
  
  /**
   * Optional variation of the image
   * If not specified, defaults based on category will be used
   */
  variation?: ImageVariation;
  
  /**
   * Optional tenant - different server environment
   * 'tranquility' (default) or 'singularity' (test server)
   */
  tenant?: 'tranquility' | 'singularity';
  
  /**
   * Whether to use HTTPS (default: true)
   */
  useHttps?: boolean;
}

/**
 * Service for interacting with EVE Online's ESI API
 */
class EsiService {
  private imageMapping: ImageMapping;
  
  constructor() {
    // Initialize service
    console.log('ESI Service initialized');
    
    // Load the image mapping
    this.imageMapping = typeImageMap as ImageMapping;
    console.log(`Loaded image mappings for ${Object.keys(this.imageMapping).length} types`);
  }

  /**
   * Generate the URL for an EVE Online image
   * 
   * @param category - The category of image (alliance, character, corporation, etc.)
   * @param id - The ID of the resource (character ID, type ID, etc.)
   * @param options - Optional parameters like size, variation, and tenant
   * @returns The complete image URL
   */
  public getImageUrl(
    category: ImageCategory,
    id: number,
    options: ImageOptions = {}
  ): string {
    // Extract options with defaults
    const { 
      size,
      variation = ImageVariation.Default,
      tenant = 'tranquility',
      useHttps = true
    } = options;
    
    // Create the protocol based on HTTPS preference
    const protocol = useHttps ? 'https' : 'http';
    
    // Base URL for the image server
    const baseUrl = `${protocol}://images.evetech.net`;
    
    // Start building the URL path
    let urlPath = `/${category}/${id}`;
    
    // Add variation if specified (and not default/empty)
    if (variation) {
      urlPath += `/${variation}`;
    }
    
    // Determine file extension based on category and variation
    // Character portraits are JPEGs, everything else is PNG
    // const fileExtension = (category === ImageCategory.Character && variation === ImageVariation.Portrait) ? 'jpg' : 'png';
    
    // Build the full URL with optional query parameters
    let url = `${baseUrl}${urlPath}`;
    
    // Add size as query parameter if specified
    const queryParams: string[] = [];
    if (size) {
      queryParams.push(`size=${size}`);
    }
    
    // Add tenant as query parameter if it's not the default
    if (tenant !== 'tranquility') {
      queryParams.push(`tenant=${tenant}`);
    }
    
    // Append query parameters if any
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    return url;
  }
    /**
   * Get URL for blueprint original (BPO) image with intelligent fallback
   * @param typeId - The type ID of the blueprint
   * @param size - Optional size parameter
   * @returns URL to the best available blueprint image
   */
  public getBlueprintOriginalUrl(typeId: number, size?: ImageSize): string | null {
    // Prefer blueprint original, then blueprint copy, then icon as fallback
    return this.getBestImageUrl(typeId, [
      ImageVariation.BPO, 
      ImageVariation.BPC, 
      ImageVariation.Icon
    ], { size });
  }
  
  /**
   * Get URL for blueprint copy (BPC) image with intelligent fallback
   * @param typeId - The type ID of the blueprint
   * @param size - Optional size parameter
   * @returns URL to the best available blueprint image
   */
  public getBlueprintCopyUrl(typeId: number, size?: ImageSize): string | null {
    // Prefer blueprint copy, then blueprint original, then icon as fallback
    return this.getBestImageUrl(typeId, [
      ImageVariation.BPC, 
      ImageVariation.BPO, 
      ImageVariation.Icon
    ], { size });
  }

  /**
   * Get URL for type icon with intelligent fallback
   * @param typeId - The type ID of the item
   * @param size - Optional size parameter
   * @returns URL to the best available type image
   */
  public getTypeIconUrl(typeId: number, size?: ImageSize): string | null {
    // Prefer icon, then render as fallback
    return this.getBestImageUrl(typeId, [
      ImageVariation.Icon,
      ImageVariation.Render
    ], { size });
  }
  
  /**
   * Get URL for rendered image with intelligent fallback
   * @param typeId - The type ID of the ship or structure
   * @param size - Optional size parameter
   * @returns URL to the best available rendered image
   */
  public getTypeRenderUrl(typeId: number, size?: ImageSize): string | null {
    // Prefer render, then icon as fallback
    return this.getBestImageUrl(typeId, [
      ImageVariation.Render,
      ImageVariation.Icon
    ], { size });
  }
  
  /**
   * Get URL for character portrait
   * 
   * @param characterId - The character ID (use 1 for default portrait)
   * @param size - Optional size parameter
   * @returns URL to the character portrait
   */
  public getCharacterPortraitUrl(characterId: number, size?: ImageSize): string {
    return this.getImageUrl(ImageCategory.Character, characterId, { 
      variation: ImageVariation.Portrait, 
      size 
    });
  }
  
  /**
   * Get URL for corporation logo
   * 
   * @param corporationId - The corporation ID (use 1 for default logo)
   *                      - Can also be an NPC faction ID for faction logos
   * @param size - Optional size parameter
   * @returns URL to the corporation logo
   */
  public getCorporationLogoUrl(corporationId: number, size?: ImageSize): string {
    return this.getImageUrl(ImageCategory.Corporation, corporationId, { 
      variation: ImageVariation.Logo, 
      size 
    });
  }
  
  /**
   * Get URL for alliance logo
   * 
   * @param allianceId - The alliance ID (use 1 for default logo)
   * @param size - Optional size parameter
   * @returns URL to the alliance logo
   */
  public getAllianceLogoUrl(allianceId: number, size?: ImageSize): string {
    return this.getImageUrl(ImageCategory.Alliance, allianceId, { 
      variation: ImageVariation.Logo, 
      size 
    });
  }

  /**
   * Get available image variations for a given type ID
   * @param typeId - The type ID to check
   * @returns Array of available image variations, or empty array if none found
   */
  public getAvailableImageVariations(typeId: number): string[] {
    return this.imageMapping[typeId.toString()] || [];
  }

  /**
   * Check if a specific image variation is available for a type
   * @param typeId - The type ID to check
   * @param variation - The image variation to check for
   * @returns true if the variation is available, false otherwise
   */
  public hasImageVariation(typeId: number, variation: ImageVariation): boolean {
    const available = this.getAvailableImageVariations(typeId);
    return available.includes(variation);
  }

  /**
   * Get the best available image URL for a type with intelligent fallback
   * @param typeId - The type ID
   * @param preferredVariations - Array of variations in order of preference
   * @param options - Optional parameters like size, tenant, etc.
   * @returns URL to the best available image, or null if no images available
   */
  public getBestImageUrl(
    typeId: number, 
    preferredVariations: ImageVariation[] = [ImageVariation.Icon], 
    options: ImageOptions = {}
  ): string | null {
    const availableVariations = this.getAvailableImageVariations(typeId);
    
    if (availableVariations.length === 0) {
      return null;
    }
    
    // Find the first preferred variation that's available
    for (const preferred of preferredVariations) {
      if (availableVariations.includes(preferred)) {
        return this.getImageUrl(ImageCategory.InventoryType, typeId, {
          ...options,
          variation: preferred
        });
      }
    }
    
    // If no preferred variations are available, use the first available one
    return this.getImageUrl(ImageCategory.InventoryType, typeId, {
      ...options,
      variation: availableVariations[0] as ImageVariation
    });
  }
}

// Create and export a singleton instance
const esiService = new EsiService();
export default esiService;