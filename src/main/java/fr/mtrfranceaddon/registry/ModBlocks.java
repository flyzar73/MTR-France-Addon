package fr.mtrfranceaddon.registry;

import fr.mtrfranceaddon.MTRFranceAddon;
import fr.mtrfranceaddon.block.LogoBlock;
import net.minecraft.block.AbstractBlock;
import net.minecraft.block.Blocks;
import org.mtr.mapping.holder.Block;
import org.mtr.mapping.holder.BlockSettings;
import org.mtr.mapping.registry.BlockRegistryObject;
import org.mtr.mod.block.BlockPlatform;

import static org.mtr.mod.Blocks.createDefaultBlockSettings;


public final class ModBlocks {

    public static final BlockRegistryObject MTRFRANCEADDON_LOGO = MTRFranceAddonRegistry.registerBlockWithItem(
            "mtrfranceaddon_logo_block",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );

    public static final BlockRegistryObject TEST_PLATFORM = MTRFranceAddonRegistry.registerBlockWithItem(
            "test_platform",
            () -> new Block(new BlockPlatform(createDefaultBlockSettings(false), false)),
            ItemGroups.MTRFranceAddonGroup
    );

    public static void register() {
        MTRFranceAddon.LOGGER.info("Registering Blocks");
    }

    public static void registerClient() {

    }

}
