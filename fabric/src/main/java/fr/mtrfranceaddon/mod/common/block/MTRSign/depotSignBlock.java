package fr.mtrfranceaddon.mod.common.block.MTRSign;

import fr.mtrfranceaddon.mod.common.block.base.DirectionalBlock;
import org.jetbrains.annotations.NotNull;
import org.mtr.mapping.holder.*;
import org.mtr.mod.block.IBlock;

public class depotSignBlock extends DirectionalBlock {
    public depotSignBlock(BlockSettings settings) {
        super(settings);
    }

    @Override
    public @NotNull org.mtr.mapping.holder.VoxelShape getOutlineShape2(BlockState state, BlockView world, BlockPos pos, ShapeContext context) {
        final Direction facing = IBlock.getStatePropertySafe(state, FACING);
        return IBlock.getVoxelShapeByDirection(5, 0, 5, 11, 16, 11, facing);
    }
}
