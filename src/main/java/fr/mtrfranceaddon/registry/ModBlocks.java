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
    public static final BlockRegistryObject SNCF_ACTUAL_LOGO = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_actuel_block",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );
    public static final BlockRegistryObject SNCF_1992TO2005_LOGO = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_1992-2005_block",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );
    public static final BlockRegistryObject SNCF_1985TO1992_LOGO_V1 = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_1985-1992_block_v1",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );
    public static final BlockRegistryObject SNCF_1985TO1992_LOGO_V2 = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_1985-1992_block_v2",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );
    public static final BlockRegistryObject SNCF_1967TO1985_LOGO_V1 = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_1967-1985_block_v1",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );
    public static final BlockRegistryObject SNCF_1967TO1985_LOGO_V2 = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_1967-1985_block_v2",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );
    public static final BlockRegistryObject SNCF_1947TO1967_LOGO = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_1947-1967_block",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );
    public static final BlockRegistryObject SNCF_1938TO1947_LOGO = MTRFranceAddonRegistry.registerBlockWithItem(
            "sncf_logo_1938-1947_block",
            () -> new Block(new LogoBlock(new BlockSettings(AbstractBlock.Settings.copy(Blocks.WHITE_WOOL)))),
            ItemGroups.MTRFranceAddonGroup
    );


    public static void register() {
        MTRFranceAddon.LOGGER.info("Registering Blocks");
    }

    public static void registerClient() {

    }

}
