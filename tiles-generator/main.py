#!/usr/bin/env python3
"""
Script to generate pyramidal tiles from a gigapixel image and create JSON metadata 
for spatial navigation with per-tile information.

Dependencies installation:
    pip install Pillow numpy tqdm
"""

import os
import json
import math
import hashlib
from pathlib import Path
from typing import Dict, Optional
from datetime import datetime
from PIL import Image
import argparse
from tqdm import tqdm

Image.MAX_IMAGE_PIXELS = None


class GigapixelTileGenerator:
    def __init__(
        self,
        image_path: str,
        output_dir: str,
        tile_size: int = 256,
        image_format: str = "JPEG",
        quality: int = 85
    ):
        """
        Initializes the tile generator.

        Args:
            image_path: Path to the original gigapixel image
            output_dir: Directory where the tiles will be saved
            tile_size: Size of each tile (256, 512, etc.)
            image_format: Output format (JPEG, PNG, WEBP)
            quality: Compression quality (1-100)
        """
        self.image_path = Path(image_path)
        self.output_dir = Path(output_dir)
        self.tile_size = tile_size
        self.image_format = image_format.upper()
        self.quality = quality

        # Extension depending on format
        self.extension = {
            'JPEG': '.jpg',
            'PNG': '.png',
            'WEBP': '.webp'
        }.get(self.image_format, '.jpg')

        self.metadata = {
            "version": "1.0",
            "generated_at": datetime.now().isoformat(),
            "source_image": str(self.image_path.name),
            "tile_size": tile_size,
            "format": self.image_format,
            "quality": quality,
            "zoom_levels": [],
            "total_tiles": 0,
            "original_dimensions": {},
            "spatial_data": {},
            "celestial_object": {},
            "capture_info": {},
            "tags": [],
            "bounds": {},
            "tiles": {}
        }

    def calculate_zoom_levels(self, width: int, height: int) -> int:
        """
        Calculates how many zoom levels are needed.
        """
        max_dimension = max(width, height)
        zoom_levels = math.ceil(math.log2(max_dimension / self.tile_size))
        return max(0, zoom_levels)

    def calculate_tile_hash(self, tile_image: Image.Image) -> str:
        """
        Calculates an MD5 hash of the tile for change detection.
        """
        return hashlib.md5(tile_image.tobytes()).hexdigest()[:16]

    def analyze_tile_content(self, tile_image: Image.Image, original_img: Image.Image,
                             col: int, row: int, zoom_level: int) -> Dict:
        """
        Analyzes the tile content and extracts relevant information.
        """
        # Convert to RGB if necessary
        if tile_image.mode != 'RGB':
            tile_image = tile_image.convert('RGB')

        # Calculate basic statistics
        img_array = list(tile_image.getdata())

        # Calculate average brightness
        brightness_values = [sum(pixel) / 3 for pixel in img_array]
        avg_brightness = sum(brightness_values) / len(brightness_values)

        # Detect if the tile is mostly empty/black
        dark_pixels = sum(1 for b in brightness_values if b < 10)
        is_empty = dark_pixels > (len(brightness_values) * 0.95)

        # Calculate coordinates in the original image
        scale_factor = 2 ** (self.metadata["zoom_levels"][-1]["level"] - zoom_level) if self.metadata["zoom_levels"] else 1
        original_x = col * self.tile_size * scale_factor
        original_y = row * self.tile_size * scale_factor

        return {
            "avg_brightness": round(avg_brightness, 2),
            "is_empty": is_empty,
            "has_content": not is_empty,
            "original_coords": {
                "x": original_x,
                "y": original_y,
                "width": self.tile_size * scale_factor,
                "height": self.tile_size * scale_factor
            }
        }

    def generate_tiles(self, metadata: Optional[Dict] = None):
        """
        Generates all pyramidal tiles from the image.

        Args:
            metadata: Optional dictionary with additional metadata
        """
        print(f"Opening image: {self.image_path}")
        print(f"Image size limit disabled (gigapixel mode)")

        # Open original image
        try:
            img = Image.open(self.image_path)
        except Exception as e:
            print(f"Error opening image: {e}")
            return

        # Convert to RGB if necessary
        if img.mode != 'RGB':
            print(f"Converting from {img.mode} to RGB")
            img = img.convert('RGB')

        original_width, original_height = img.size
        print(f"Original dimensions: {original_width}x{original_height} px")

        # Calculate megapixels and gigapixels
        total_pixels = original_width * original_height
        megapixels = total_pixels / 1_000_000
        gigapixels = total_pixels / 1_000_000_000

        if gigapixels >= 1:
            print(f"Size: {gigapixels:.2f} gigapixels")
        else:
            print(f"Size: {megapixels:.2f} megapixels")

        file_size_mb = self.image_path.stat().st_size / (1024**2)
        print(f"File size: {file_size_mb:.2f} MB")

        # Save original dimensions
        self.metadata["original_dimensions"] = {
            "width": original_width,
            "height": original_height,
            "total_pixels": total_pixels,
            "megapixels": round(megapixels, 2),
            "gigapixels": round(gigapixels, 2) if gigapixels >= 0.01 else None
        }

        # Calculate zoom levels
        max_zoom = self.calculate_zoom_levels(original_width, original_height)
        print(f"Calculated zoom levels: 0 to {max_zoom}")

        # Estimate total tiles
        estimated_tiles = 0
        for z in range(max_zoom + 1):
            scale = 2 ** (max_zoom - z)
            w = math.ceil(original_width / scale)
            h = math.ceil(original_height / scale)
            cols = math.ceil(w / self.tile_size)
            rows = math.ceil(h / self.tile_size)
            estimated_tiles += cols * rows

        print(f"Estimated tiles: ~{estimated_tiles:,}")
        print(f"\nStarting tile generation...\n")

        # Create base directory
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Generate tiles for each level
        total_tiles = 0
        for zoom_level in range(max_zoom + 1):
            tiles_generated = self._generate_zoom_level(img, zoom_level, max_zoom)
            total_tiles += tiles_generated

        self.metadata["total_tiles"] = total_tiles

        # Add additional metadata if provided
        if metadata:
            self._add_custom_metadata(metadata)

        # Save metadata JSON
        self._save_metadata()

        print(f"\nProcess completed!")
        print(f"Total tiles generated: {total_tiles:,}")
        print(f"Location: {self.output_dir}")

        img.close()

    def _generate_zoom_level(self, original_img: Image.Image, zoom_level: int, max_zoom: int) -> int:
        """
        Generates tiles for a specific zoom level.
        """
        # Calculate scale factor for this level
        scale_factor = 2 ** (max_zoom - zoom_level)

        # Calculate dimensions for this level
        scaled_width = math.ceil(original_img.width / scale_factor)
        scaled_height = math.ceil(original_img.height / scale_factor)

        # Resize image for this level
        if zoom_level == max_zoom:
            scaled_img = original_img
            print(f"\nZoom Level {zoom_level} (MAXIMUM DETAIL):")
        else:
            print(f"\nZoom Level {zoom_level}:")
            print(f"   Resizing image... ", end='', flush=True)
            scaled_img = original_img.resize(
                (scaled_width, scaled_height),
                Image.Resampling.LANCZOS
            )
            print("✓")

        # Calculate how many tiles are needed in each dimension
        cols = math.ceil(scaled_width / self.tile_size)
        rows = math.ceil(scaled_height / self.tile_size)

        total_tiles_level = cols * rows

        print(f"   Dimensions: {scaled_width:,}x{scaled_height:,} px")
        print(f"   Grid: {cols}x{rows} tiles ({total_tiles_level:,} tiles)")

        # Create directory for this level
        level_dir = self.output_dir / str(zoom_level)
        level_dir.mkdir(parents=True, exist_ok=True)

        # Initialize tiles structure for this level
        if str(zoom_level) not in self.metadata["tiles"]:
            self.metadata["tiles"][str(zoom_level)] = {}

        # Generate each tile
        tiles_generated = 0
        with tqdm(total=total_tiles_level, desc=f"   Generating", unit="tile") as pbar:
            for row in range(rows):
                row_dir = level_dir / str(row)
                row_dir.mkdir(exist_ok=True)

                # Initialize row in metadata
                if str(row) not in self.metadata["tiles"][str(zoom_level)]:
                    self.metadata["tiles"][str(zoom_level)][str(row)] = {}

                for col in range(cols):
                    # Calculate tile region
                    left = col * self.tile_size
                    top = row * self.tile_size
                    right = min(left + self.tile_size, scaled_width)
                    bottom = min(top + self.tile_size, scaled_height)

                    # Crop tile
                    tile = scaled_img.crop((left, top, right, bottom))

                    # If the tile is smaller than tile_size, expand with black
                    if tile.width < self.tile_size or tile.height < self.tile_size:
                        expanded = Image.new('RGB', (self.tile_size, self.tile_size), (0, 0, 0))
                        expanded.paste(tile, (0, 0))
                        tile = expanded

                    # Analyze tile content
                    tile_info = self.analyze_tile_content(tile, original_img, col, row, zoom_level)

                    # Calculate tile hash
                    tile_hash = self.calculate_tile_hash(tile)

                    # Save tile
                    tile_path = row_dir / f"{col}{self.extension}"

                    if self.image_format == 'JPEG':
                        tile.save(tile_path, 'JPEG', quality=self.quality, optimize=True)
                    elif self.image_format == 'PNG':
                        tile.save(tile_path, 'PNG', optimize=True)
                    elif self.image_format == 'WEBP':
                        tile.save(tile_path, 'WEBP', quality=self.quality)

                    # Get file size
                    file_size = tile_path.stat().st_size

                    # Save metadata for the tile
                    self.metadata["tiles"][str(zoom_level)][str(row)][str(col)] = {
                        "path": f"{zoom_level}/{row}/{col}{self.extension}",
                        "size": file_size,
                        "hash": tile_hash,
                        "position": {
                            "col": col,
                            "row": row,
                            "x": left,
                            "y": top
                        },
                        "dimensions": {
                            "width": right - left,
                            "height": bottom - top
                        },
                        "content": tile_info,
                        "url": f"/{zoom_level}/{row}/{col}{self.extension}"
                    }

                    tiles_generated += 1
                    pbar.update(1)

        # Save zoom level info in metadata
        self.metadata["zoom_levels"].append({
            "level": zoom_level,
            "width": scaled_width,
            "height": scaled_height,
            "cols": cols,
            "rows": rows,
            "tiles": total_tiles_level,
            "scale_factor": scale_factor
        })

        if zoom_level != max_zoom:
            scaled_img.close()

        return tiles_generated

    def _add_custom_metadata(self, custom_data: Dict):
        """
        Adds custom metadata to the JSON.
        """
        # Spatial information
        if "spatial" in custom_data:
            self.metadata["spatial_data"] = {
                "coordinates": custom_data["spatial"].get("coordinates", {}),
                "coordinate_system": custom_data["spatial"].get("coordinate_system", "equatorial"),
                "right_ascension": custom_data["spatial"].get("right_ascension"),
                "declination": custom_data["spatial"].get("declination"),
                "cartesian": custom_data["spatial"].get("cartesian", {}),
                "distance_from_earth": custom_data["spatial"].get("distance_from_earth"),
                "distance_unit": custom_data["spatial"].get("distance_unit", "light-years")
            }

        # Celestial object
        if "celestial_object" in custom_data:
            self.metadata["celestial_object"] = {
                "name": custom_data["celestial_object"].get("name", "Unknown"),
                "type": custom_data["celestial_object"].get("type", "Unknown"),
                "catalog_id": custom_data["celestial_object"].get("catalog_id"),
                "alternative_names": custom_data["celestial_object"].get("alternative_names", []),
                "constellation": custom_data["celestial_object"].get("constellation"),
                "magnitude": custom_data["celestial_object"].get("magnitude")
            }

        # Capture info
        if "capture" in custom_data:
            self.metadata["capture_info"] = {
                "date": custom_data["capture"].get("date"),
                "time_utc": custom_data["capture"].get("time_utc"),
                "exposure_time": custom_data["capture"].get("exposure_time"),
                "satellite_telescope": custom_data["capture"].get("satellite_telescope"),
                "instrument": custom_data["capture"].get("instrument"),
                "filters": custom_data["capture"].get("filters", []),
                "wavelength": custom_data["capture"].get("wavelength"),
                "mission": custom_data["capture"].get("mission"),
                "observer": custom_data["capture"].get("observer")
            }

        # Tags and categories
        if "tags" in custom_data:
            self.metadata["tags"] = custom_data["tags"]

        # Description
        if "description" in custom_data:
            self.metadata["description"] = custom_data["description"]

        # Visibility
        if "visibility" in custom_data:
            self.metadata["visibility"] = custom_data["visibility"]

        # Additional scientific data
        if "scientific_data" in custom_data:
            self.metadata["scientific_data"] = custom_data["scientific_data"]

        # Calculate bounds (bounding box) for navigation
        zoom_max = self.metadata["zoom_levels"][-1] if self.metadata["zoom_levels"] else {}
        if zoom_max:
            self.metadata["bounds"] = {
                "width": zoom_max["width"],
                "height": zoom_max["height"],
                "center": {
                    "x": zoom_max["width"] / 2,
                    "y": zoom_max["height"] / 2
                }
            }

    def _save_metadata(self):
        """
        Saves the metadata.json file
        """
        metadata_path = self.output_dir / "metadata.json"

        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, indent=2, ensure_ascii=False)

        print(f"\nMetadata saved at: {metadata_path}")

        # Also save a summary without detailed tile information (for quick loading)
        summary_metadata = {k: v for k, v in self.metadata.items() if k != "tiles"}
        summary_path = self.output_dir / "metadata_summary.json"

        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary_metadata, f, indent=2, ensure_ascii=False)

        print(f"Metadata summary saved at: {summary_path}")


def main():
    parser = argparse.ArgumentParser(
        description='Generates pyramidal tiles from a gigapixel image with spatial metadata',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""Usage examples:
  %(prog)s image.jpg -o ./tiles/andromeda
  %(prog)s image.tif -o ./tiles/mars -s 512 -f WEBP -q 90
  %(prog)s image.jpg -o ./output -m metadata.json
        """
    )

    parser.add_argument(
        'image',
        type=str,
        help='Path to the input gigapixel image'
    )

    parser.add_argument(
        '-o', '--output',
        type=str,
        required=True,
        help='Output directory for the tiles'
    )

    parser.add_argument(
        '-s', '--tile-size',
        type=int,
        default=256,
        help='Tile size in pixels (default: 256)'
    )

    parser.add_argument(
        '-f', '--format',
        type=str,
        choices=['JPEG', 'PNG', 'WEBP'],
        default='JPEG',
        help='Image format for tiles (default: JPEG)'
    )

    parser.add_argument(
        '-q', '--quality',
        type=int,
        default=85,
        help='Compression quality 1-100 (default: 85)'
    )

    parser.add_argument(
        '-m', '--metadata',
        type=str,
        help='Path to JSON file with additional metadata'
    )

    args = parser.parse_args()

    # Banner
    print("=" * 60)
    print("GIGAPIXEL TILE GENERATOR - NASA SPACE APPS")
    print("=" * 60)
    print()

    # Load additional metadata if provided
    custom_metadata = None
    if args.metadata:
        try:
            with open(args.metadata, 'r', encoding='utf-8') as f:
                custom_metadata = json.load(f)
            print(f"Metadata loaded from: {args.metadata}\n")
        except Exception as e:
            print(f"Could not load metadata: {e}\n")

    # Create generator
    generator = GigapixelTileGenerator(
        image_path=args.image,
        output_dir=args.output,
        tile_size=args.tile_size,
        image_format=args.format,
        quality=args.quality
    )

    # Generate tiles
    generator.generate_tiles(metadata=custom_metadata)

    print("\n" + "=" * 60)
    print("Tiles successfully generated!")
    print("=" * 60)


if __name__ == "__main__":
    main()
