package fr.mtrfranceaddon.mod.common.registry;

import fr.mtrfranceaddon.mod.common.Init;
import fr.mtrfranceaddon.mod.common.block.InvisiblePlatform;
import org.mtr.mapping.holder.BlockEntity;
import org.mtr.mapping.holder.Identifier;
import org.mtr.mapping.registry.BlockEntityTypeRegistryObject;

public class ModBlockEntities {

    public static final BlockEntityTypeRegistryObject<InvisiblePlatform.InvPlatBE> INVISIBLE_PLATFORM = MTRFranceAddonRegistry.REGISTRY.registerBlockEntityType(
            new Identifier("mtrfranceaddon", "invisible_platform"), InvisiblePlatform.InvPlatBE::new, ModBlocks.INVISIBLE_PLATFORM::get
    );

    public static void register() {
        Init.LOGGER.info("Registering Block Entities");
    }

}
